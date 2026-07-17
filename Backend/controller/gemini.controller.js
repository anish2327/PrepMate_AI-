import model from "../config/gemini.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export const testGemini = async (req, res) => {
  try {
    const result = await model.generateContent(
      "What is React?"
    );

    res.json({
      answer: result.response.text(),
    });

  } catch (error) {
    console.log("Gemini Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};