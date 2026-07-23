import InterviewResult from "../model/interviewResult.model.js";
import model from "../config/gemini.js";
import {
  extractResumeText,
  createChunks,
} from "../service/resume.service.js";

import {
  retrieveRelevantChunks,
} from "../service/rag.service.js";


// geneatte a interview question based on role and experience
export const generateQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      numberOfQuestions,
    } = req.body;

    let resumeContext = "";
    let resumeBased = false;
    const count = Number(numberOfQuestions);

  if (![5, 10, 15, 20,25].includes(count)) {
  return res.status(400).json({
    success: false,
    message: "Invalid question count",
  });
}

    // =====================================
    // STEP 1: PROCESS RESUME
    // =====================================

    if (req.file) {
      console.log(
        "Resume received:",
        req.file.originalname
      );

      // Extract resume text
      const resumeText =
        await extractResumeText(
          req.file.buffer
        );

      console.log(
        "Resume text length:",
        resumeText.length
      );

      // Create chunks
      const chunks =
        createChunks(resumeText);

      console.log(
        "Total chunks:",
        chunks.length
      );

      // Retrieve relevant chunks
      const relevantChunks =
        retrieveRelevantChunks(
          chunks,
          role,
          difficulty
        );

      console.log(
        "Relevant chunks:",
        relevantChunks.length
      );

      // Combine relevant chunks
      resumeContext =
        relevantChunks.join("\n\n");

      resumeBased = true;
    }

    // =====================================
    // STEP 2: CREATE GEMINI PROMPT
    // =====================================

    const prompt = `
You are a professional technical interviewer.

Generate exactly ${count} interview questions.

Candidate Information:

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

special instructions for generating questions based on DSA role:
- If the role is DSA, focus on data structures and algorithms.
- Ask questions based on common DSA problems from platforms like LeetCode, HackerRank, and GeeksforGeeks.
- Ask questions that test problem-solving skills, algorithmic thinking, and coding ability.
-Half no of question should be based on codinh skills and half should be based on thoery and algorithms concepts.


${
  resumeBased
    ? `
The candidate has uploaded a resume.

Below is relevant information retrieved from the candidate's resume:

---------------- RESUME CONTEXT ----------------

${resumeContext}

------------------------------------------------

Generate personalized interview questions primarily based on the candidate's resume.

Focus on:
Asked relevant questions based on the candidate's projects, technical skills, and experience mentioned in the resume.

1. Projects mentioned in the resume
2. Technical skills mentioned in the resume
3. Technologies used in the projects
4. Candidate's technical experience
5. Implementation decisions
6. Challenges faced in projects
7. Architecture and design decisions
8. Question based on previous year of interviewquestion in company about skills and projects mentioned in resume.
9. Asked about the candidate's understanding of the technologies and tools used in their projects.
10. Asked question on work experience and role mentioned in resume.

The purpose is to verify whether the candidate genuinely understands the projects and technologies listed in their resume.

IMPORTANT RULES:

- At least 70 percent of the questions MUST be directly related to the candidate's resume.
- Focus strongly on Projects and Technical Skills.
- Mention project names in questions when appropriate.
- Ask implementation-based questions.
- Ask why the candidate chose specific technologies.
- Ask about challenges and technical decisions.
- Do NOT invent projects that are not present in the resume.
- Do NOT assume the candidate used a technology unless it appears in the provided resume context.

Examples:

If the resume mentions a MERN e-commerce project, you may ask:

"Explain the backend architecture you designed for your e-commerce application."

If the resume mentions JWT authentication, you may ask:

"How did you implement JWT authentication in your project, and how did you protect private routes?"

If the resume mentions Razorpay, you may ask:

"Explain the complete Razorpay payment flow you implemented in your project."

If the resume mentions MongoDB, you may ask:

"How did you design your MongoDB schemas, and why did you choose MongoDB?"

The remaining questions can test general technical knowledge related to:

Role: ${role}

`
    : `
The candidate did not upload a resume.

Generate interview questions based on:

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Focus on concepts and practical knowledge relevant to the selected role.
like His selected role is DSA then asked question based on DSA problem from the famous leetcode  question those asked in the previous year of interview question in the company.
`
}

Difficulty Rules:

Easy:
- Fundamentals
- Basic concepts
- Simple project explanations
- basic coding questions
- basic DSA problems

Medium:
- Implementation details
- Practical concepts
- Project decisions
- Debugging scenarios

Hard:
- Architecture
- Scalability
- Security
- Performance
- Advanced implementation
- Real-world scenarios
- backend and frontend integration

OUTPUT RULES:

Return ONLY a valid JSON array containing exactly ${count} strings.


Do not include markdown.

Do not include explanations.

Do not include JSON code blocks.

Correct format:

[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5",
  "Question 6",
  "Question 7",
  "Question 8",
  "Question 9",
  "Question 10"
  "Question 11",
  "Question 12",
  "Question 13",
  "Question 14",
  "Question 15",
  "Question 16",
  "Question 17",
  "Question 18",
  "Question 19",
  "Question 20",
  "Question 21",
  "Question 22",
  "Question 23",
  "Question 24",
  "Question 25",
]
`;

    // =====================================
    // STEP 3: CALL GEMINI
    // =====================================

    const result =
      await generateWithRetry(prompt);

    const text =
      result.response.text();

    console.log(
      "Gemini Raw Response:",
      text
    );

    // =====================================
    // STEP 4: CLEAN GEMINI RESPONSE
    // =====================================

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // =====================================
    // STEP 5: PARSE QUESTIONS
    // =====================================

    const questions =
      JSON.parse(cleanedText);

    if (!Array.isArray(questions)) {
      throw new Error(
        "Gemini response is not an array"
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
  throw new Error(
    "Gemini did not return valid interview questions"
  );
}

    // =====================================
    // STEP 6: SEND RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,
      role,
      experience,
      difficulty,
      resumeBased,
      requestedQuestions: count,
      generatedQuestions: questions.length,
      questions,
    });

  } catch (error) {

    console.error(
      "Generate Questions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate questions",
    });
  }
};

// retry logic for Gemini API calls
async function generateWithRetry(prompt) {
  let attempts = 3;

  while (attempts > 0) {
    try {
      const result =
        await model.generateContent(prompt);

      return result;
    } catch (error) {

      if (
        error.message.includes("503")
      ) {
        attempts--;

        console.log(
          "Retrying Gemini..."
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

      } else {
        throw error;
      }
    }
  }

  throw new Error(
    "Gemini service unavailable"
  );
}
 // evaluate interview answers and return score, strengths, weaknesses and feedback
export const evaluateInterview = async (req, res) => {
  try {
    const { role, experience,  difficulty,answers } = req.body;

    const prompt = `
    You are a senior technical interviewer.

    Evaluate the following interview answers.
    

    Role: ${role}
    Experience: ${experience}

    Score should be between 0 and 100.

    Consider:
    - Technical Accuracy
    - Completeness of Answer
    - Communication Skills
    - Problem Solving Ability
    - Approach for DSA problems and coding questions


    Answers:
    ${answers
      .map(
        (item, index) => `
    Question ${index + 1}: ${item.question}
    Answer: ${item.answer}
    `
      )
      .join("\n")}

    Return ONLY valid JSON in this format:

    {
      "score": 85,
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "feedback": "Overall feedback"
    }
    `;

  const result = await generateWithRetry(prompt);

    const text = result.response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(cleanedText);

    const resultData = {
      role,
      experience,
      ...aiResult,
    };

    await InterviewResult.create(resultData);

    return res.json(resultData);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
 // get inteview history from database and return to frontend
export const getInterviewHistory = async (req, res) => {
  try {

    const history =
      await InterviewResult.find()
      .sort({ createdAt: -1 });

    return res.json(history);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};