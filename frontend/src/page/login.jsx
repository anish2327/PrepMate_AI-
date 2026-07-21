
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // NORMAL EMAIL/PASSWORD LOGIN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = data;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      console.log("Normal Login Response:", result);

      if (!response.ok || !result.success) {
        toast.error(
          result.message || "Login failed"
        );
        return;
      }

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(result.data.user)
      );

      // Save access token
      if (result.data.accessToken) {
        localStorage.setItem(
          "accessToken",
          result.data.accessToken
        );
      }

      
      if (result.data.refreshToken || result.data.refresToken) {
          localStorage.setItem("refreshToken",result.data.refreshToken || result.data.refresToken);
        }

      toast.success("Login Successful 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(
        "Normal Login Error:",error
      );

      toast.error(
        "Something went wrong!"
      );
    }
  };

  
  // Google login 

  const handleGoogleSuccess = async (
    credentialResponse) => {
    try {
      // Check Google credential
      if (!credentialResponse.credential) {
        toast.error(
          "Google credential not received"
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/google-login`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",
          body: JSON.stringify({
            token:
              credentialResponse.credential,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Google Login Response:",
        result
      );

      if (!response.ok || !result.success) {
        toast.error(
          result.message ||
            "Google login failed"
        );
        return;
      }

      // Save user
      localStorage.setItem("user",JSON.stringify(result.data.user));

      // Save access token
      if (result.data.accessToken) {
        localStorage.setItem("accessToken",result.data.accessToken
        );
      }

      // Save refresh token
      if (result.data.refreshToken) {
        localStorage.setItem(
          "refreshToken",result.data.refreshToken
        );
      }

      toast.success(
        "Google Login Successful 🎉"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      toast.error(
        "Google login failed!"
      );
    }
  };

  return (
    <div className="min-h-screen flex gap-20 items-center justify-center bg-gray-700 px-5">

      {/* LEFT SECTION */}

      <div className="w-full max-w-md py-4 px-4 rounded-lg bg-gray-800">

        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl">
          👤
        </div>

        <div className="flex flex-col gap-2">

          <h1 className="text-3xl text-center py-1 px-2 text-white font-bold">
            📱 AI Interview{" "}
            <span className="text-violet-600">
              Test
            </span>{" "}
            👋
          </h1>

          <p className="text-center text-xl text-white px-2 py-2">
           Start your journey toward interview success! 🚀 Practice AI-powered interviews 
           tailored to your role, experience, and skill level. Upload your resume to get 
           personalized questions based on your projects and technical skills, receive AI-powered 
           performance feedback, and build the confidence you need to succeed in placements, internships, 
           and job interviews.

            🔒💬
          </p>

        </div>
      </div>

      {/* LOGIN SECTION */}

      <div className="w-full max-w-md bg-gray-900 rounded-lg p-5">

        <h1 className="font-extrabold text-2xl text-green-500 text-center mt-2">
          Welcome Back
        </h1>

        <p className="text-xl text-center mt-2 text-white">
          Please login to your account
        </p>

        <form
          className="w-full px-1 py-3 flex flex-col mt-8 space-y-5"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <input
            type="email"
            id="email"
            name="email"
            placeholder="👤 Enter your email"
            className="w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={data.email}
            onChange={handleOnChange}
          />

          {/* PASSWORD */}

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              id="password"
              name="password"
              placeholder="🔒 Enter your password"
              className="w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={data.password}
              onChange={handleOnChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="w-full text-xl font-bold text-white bg-green-500 py-3 px-2 rounded-2xl text-center hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Login
          </button>

          {/* DIVIDER */}

          <div className="flex items-center gap-3 my-6">

            <div className="h-px bg-gray-200 flex-1" />

            <span className="text-xs text-gray-400">
              OR CONTINUE WITH
            </span>

            <div className="h-px bg-gray-200 flex-1" />

          </div>

          {/* GOOGLE LOGIN */}

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={() =>
                toast.error(
                  "Google login failed"
                )
              }
              text="continue_with"
              shape="rectangular"
            />

          </div>

          {/* FORGOT PASSWORD */}

          <p className="text-sm text-violet-500 text-end font-semibold mx-1">
            Forgot password?
          </p>

          {/* SIGNUP */}

          <p className="text-sm text-white font-serif text-center px-4 py-2">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-blue-500 font-semibold"
            >
              Signup
            </Link>

          </p>

        </form>
      </div>

    </div>
  );
};
export default Login;