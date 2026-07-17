import InterviewResult from "../model/interviewResult.model.js";
import model from "../config/gemini.js";
// geneatte a interview question based on role and experience
export const generateQuestions = async (req, res) => {
  try {
    const { role, experience ,  difficulty,} = req.body;

   const prompt = `
    Generate exactly 10 interview questions.

    Role: ${role}

    Experience: ${experience}

    Difficulty: ${difficulty}

    Rules:
    - Easy → Basic concepts
    - Medium → Intermediate concepts
    - Hard → Advanced concepts, real-world scenarios

    Return ONLY a valid JSON array.

    Example:
    [
      "Question 1",
      "Question 2"
    ]
    `;
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleanedText);

    return res.status(200).json({
      success: true,
      role,
      experience,
      questions,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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