import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard se role aur experience aayega

  // Temporary Questions
  // Baad me Gemini API se aayenge

    const {
    role,
    experience,
    difficulty,
    questions,
} = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleNext = async () => {
  const updatedAnswers = [
    ...answers,
    {
      question: questions[currentQuestion],
      answer,
    },
  ];

  if (currentQuestion < questions.length - 1) {
    setAnswers(updatedAnswers);
    setCurrentQuestion(currentQuestion + 1);
    setAnswer("");
  } else {

    try {
      const response = await axios.post(
        "http://localhost:3000/api/interview/evaluate",
        {
        
        role,
        experience,
        difficulty,
        answers: updatedAnswers,
      
        }
      );
      console.log(response.data);

      navigate("/result", {
      state: {
        ...response.data,
        answers: updatedAnswers,
      },
    });

    } catch (error) {
      console.log(error);
    }
  }
};

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-3">
          AI Interview Test
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Role: {role} | Experience: {experience}| Difficulty: {difficulty}
        </p>

        <div className="bg-gray-900 border border-purple-500 rounded-2xl p-8">

          <div className="flex justify-between mb-6">
            <span>
              Question {currentQuestion + 1}
            </span>

            <span>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {questions[currentQuestion]}
          </h2>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white outline-none"
          />

          <button
            onClick={handleNext}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold"
          >
            {currentQuestion === questions.length - 1
              ? "Submit Interview"
              : "Next Question"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Interview;