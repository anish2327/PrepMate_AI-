import model from "../config/gemini.js";

export const generateQuestions = async (req,res) => {
  
  try {
    const { role, experience } = req.body;

          const prompt = `
      Generate 10 interview questions.

      Role: ${role}

      Experience: ${experience}

      Return only a JSON array.
      `;

    const result = await model.generateContent(
      prompt
    );

    const response =
      result.response.text();

    res.json({
      success: true,
      questions: response,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};