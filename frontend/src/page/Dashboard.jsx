import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LogoutButton from "../component/logout";

const Dashboard = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
   const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
 

  const handleStartInterview = async () => {
  try {
    if (!role || !experience || !difficulty) {
      alert("Please select role, experience, and difficulty");
      return;
    }
     const formData = new FormData();

      formData.append("role", role);
      formData.append("experience", experience);
      formData.append("difficulty", difficulty);

      // Resume is optional
      if (resume) {
        formData.append("resume", resume);
      }

      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/interview/start`,
        formData
      );

      navigate("/interview", {
        state: {
          role,
          experience,
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

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DSA",
    "DBMS",
    "OOPs",
    "HR Interview",
  ];


  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-4xl mx-auto flex justify-end mb-4">
      <LogoutButton />
     </div>

      
      <h1 className="text-4xl font-bold text-center mb-3">
        Welcome 👋
      </h1>

      <p className="text-center text-gray-400 mb-12">
        Select your interview category and start practicing.
      </p>

      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-2xl border border-purple-500">

        <h2 className="text-2xl font-semibold mb-6">
          Select Interview Role
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              className={`p-4 rounded-xl border transition-all
                ${
                  role === item
                    ? "bg-purple-600 border-purple-600"
                    : "bg-gray-800 border-gray-700"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

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

      
     
            {/* resume section */}
            
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-2">
            Upload Resume
          </h2>

          <p className="text-gray-400 mb-4">
            Optional — Upload your resume to get personalized
            interview questions based on your skills and projects.
          </p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700"
          />

          {resume && (
            <p className="text-purple-400 mt-3">
              Selected: {resume.name}
            </p>
          )}
        </div>


        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 py-4 rounded-lg font-semibold"
        >
          {loading
            ? "Generating Questions..."
            : "Start Interview"}
        </button>

      </div>
    </div>
  );
};

export default Dashboard;