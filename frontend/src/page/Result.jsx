import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../component/logout";


const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Result State:", location.state);


  // Temporary Score Logic
const {
  role = "",
  experience = "",
  score = 0,
  strengths = [],
  weaknesses = [],
  feedback = "",
  answers = [],
} = location.state || {};



  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>


        <h1 className="text-4xl font-bold text-center mb-4">
          Interview Result
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Role: {role} | Experience: {experience}
        </p>

        <div className="bg-gray-900 border border-purple-500 rounded-2xl p-8">

          {/* Score */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Overall Score
            </h2>

            <div className="text-6xl font-bold text-purple-500">
              {score}/100
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-green-400 mb-4">
              Strengths
            </h3>

            <ul className="space-y-2">
              {strengths.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-red-400 mb-4">
              Areas for Improvement
            </h3>

            <ul className="space-y-2">
              {weaknesses.map((item, index) => (
                <li key={index}>⚠️ {item}</li>
              ))}
            </ul>
          </div>

          {/* Feedback */}
          <div className="bg-gray-800 p-5 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">
              AI Feedback
            </h3>

            <p className="text-gray-300">
              {feedback}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg"
            >
              New Interview
            </button>

            <button
              onClick={() => navigate("/history")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg"
            >
              View History
            </button>
          </div>
        </div>

        {/* Answers Review */}
        <div className="mt-10 bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Your Answers
          </h2>

          {answers?.map((item, index) => (
            <div
              key={index}
              className="mb-6 border-b border-gray-700 pb-4"
            >
              <h3 className="font-semibold text-purple-400 mb-2">
                Q{index + 1}: {item.question}
              </h3>

              <p className="text-gray-300">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Result;