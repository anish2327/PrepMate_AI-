import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../component/logout";

const Dashboard = () => {
  const navigate = useNavigate();

  const [interviewMode, setInterviewMode] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const[numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DSA",
    "Core Cs Subjects",
    "HR Interview",
    "System Design",
    "(SDE) + AI Integration",
    "Ai/ML Engineer",

  ];

  const handleModeChange = (mode) => {
    setInterviewMode(mode);

    // Reset previous selections
    setRole("");
    setExperience("");
    setDifficulty("");
    setResume(null);
    setNumberOfQuestions(5);
  };

  const handleStartInterview = async () => {
    try {
      // Standard interview validation
      if (interviewMode === "standard") {
        if (!role || !experience || !difficulty) {
          alert("Please select role, experience, and difficulty");
          return;
        }
      }

      // Resume interview validation
      if (interviewMode === "resume") {
        if (!resume || !difficulty) {
          alert("Please upload your resume and select difficulty");
          return;
        }
      }

      if (!interviewMode) {
        alert("Please select an interview mode");
        return;
      }

      const formData = new FormData();

      formData.append("difficulty", difficulty);
      formData.append("numberOfQuestions", numberOfQuestions);
      if (interviewMode === "standard") {
        formData.append("role", role);
        formData.append("experience", experience);
      }

      if (interviewMode === "resume") {
        formData.append("resume", resume);

        // Backend compatibility
        formData.append("role", "Resume Based Interview");
        formData.append("experience", "Based on Resume");
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/start`,
        formData
      );

      navigate("/interview", {
        state: {
          role:
            interviewMode === "resume"
              ? "Resume Based Interview"
              : role,
          experience:
            interviewMode === "resume"
              ? "Based on Resume"
              : experience,
          difficulty,
          questions: response.data.questions,
          resumeBased: response.data.resumeBased,
        },
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to generate interview questions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* Logout */}
      <div className="max-w-4xl mx-auto flex justify-end mb-4">
        <LogoutButton />
      </div>

      <h1 className="text-4xl font-bold text-center mb-3">
        Welcome 👋
      </h1>

      <p className="text-center text-gray-400 mb-10">
        Choose your interview type and start practicing.
      </p>

      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-2xl border border-purple-500">

        {/* Interview Mode */}
        <h2 className="text-2xl font-semibold mb-5">
          Choose Interview Mode
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <button
            onClick={() => handleModeChange("standard")}
            className={`p-5 rounded-xl border transition-all ${
              interviewMode === "standard"
                ? "bg-purple-600 border-purple-500"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h3 className="font-semibold text-lg">
              Standard Interview
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              Select role, experience and difficulty
            </p>
          </button>

          <button
            onClick={() => handleModeChange("resume")}
            className={`p-5 rounded-xl border transition-all ${
              interviewMode === "resume"
                ? "bg-purple-600 border-purple-500"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h3 className="font-semibold text-lg">
              Resume-Based Interview
            </h3>

            <p className="text-sm text-gray-300 mt-2">
              Upload resume and get personalized questions
            </p>
          </button>

        </div>

        {/* STANDARD INTERVIEW */}
        {interviewMode === "standard" && (
          <>
            {/* Role */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">
                Select Interview Role
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((item) => (
                  <button
                    key={item}
                    onClick={() => setRole(item)}
                    className={`p-4 rounded-xl border transition-all ${
                      role === item
                        ? "bg-purple-600 border-purple-600"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">
                Experience Level
              </h2>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 Year">0-1 Year</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>
            {/* Number of Questions
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">
                Number of Questions
              </h2> 
              <select
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div> */}
          </>
        )}

        {/* RESUME INTERVIEW */}
        {interviewMode === "resume" && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-2">
              Upload Resume
            </h2>

            <p className="text-gray-400 mb-4">
              Upload your PDF resume to generate personalized
              questions based on your projects and technical skills.
            </p>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
            />

            {resume && (
              <p className="text-purple-400 mt-3">
                Selected: {resume.name}
              </p>
            )}
          </div>

        )}

        {/* Difficulty - Common for both */}
        {interviewMode && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">
              Difficulty Level
            </h2>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
        )}
        {interviewMode && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">
              Number of Questions
            </h2>
              <select
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>
            )}

        {/* Start Button */}
        {interviewMode && (
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 py-4 rounded-lg font-semibold"
          >
            {loading
              ? "Generating Questions..."
              : interviewMode === "resume"
              ? "Start Resume-Based Interview"
              : "Start Interview"}
          </button>
        )}

      </div>
    </div>
  );
};

export default Dashboard;