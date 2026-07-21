import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    checkbox: false,
  });

  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const {
      name,
      type,
      checked,
      value,
    } = e.target;

    setData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };
  // GOOGLE SIGNUP / LOGIN
  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        toast.error(
          "Google credential not received"
        );
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            token:
              credentialResponse.credential,
          }),
        }
      );

      const result =
        await response.json();
      console.log(
        "Google Signup Response:",
        result
      );

      if (!response.ok || !result.success) {
        toast.error(
          result.message ||
            "Google signup failed"
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

      // Save refresh token
      if (result.data.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          result.data.refreshToken
        );
      }

      toast.success(
        "Google Signup Successful 🎉"
      );

      // User is already authenticated
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(
        "Google Signup Error:",
        error
      );

      toast.error(
        "Google signup failed!"
      );
    }
  };


  // NORMAL SIGNUP


  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullname,
      email,
      password,
      confirmPassword,
      checkbox,
    } = data;

    if (
      !fullname ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error(
        "Please provide all details"
      );
      return;
    }

    if (!checkbox) {
      toast.error(
        "Please agree to the Terms and Conditions"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords don't match"
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: fullname,
            email,
            password,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        toast.error(
          result.message ||
            "Signup failed"
        );
        return;
      }

      toast.success(
        result.message ||
          "Signup successful"
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      toast.error(
        "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700 px-5">

      <div className="w-full max-w-md bg-gray-900 rounded-lg p-6">

        {/* TITLE */}

        <h1 className="font-extrabold text-3xl text-green-500 text-center mt-2">
          Register
        </h1>

        <h2 className="font-bold text-xl text-amber-400 text-center mt-3">
          Let's get started
        </h2>

        <p className="text-white text-center mt-2">
          Create your account and start
          practicing AI-powered interviews.
          💬
        </p>

        {/* FORM */}

        <form
          className="w-full py-3 flex flex-col mt-6 space-y-5"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            className="w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.fullname}
            onChange={handleOnChange}
          />

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full bg-slate-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              name="password"
              placeholder="Password"
              className="w-full bg-slate-200 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-700"
            >
              {showPassword
                ? <BiShow />
                : <BiHide />}
            </button>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full bg-slate-200 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={
                data.confirmPassword
              }
              onChange={handleOnChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-700"
            >
              {showConfirmPassword
                ? <BiShow />
                : <BiHide />}
            </button>

          </div>

          {/* TERMS */}

          <label className="text-gray-400 flex items-start gap-2">

            <input
              type="checkbox"
              name="checkbox"
              checked={data.checkbox}
              onChange={handleOnChange}
              className="mt-1 h-4 w-4 accent-indigo-600 cursor-pointer"
            />

            <span>
              I agree with{" "}
              <span className="text-indigo-400">
                Terms and Conditions
              </span>{" "}
              and the{" "}
              <span className="text-indigo-400">
                Privacy Policy
              </span>
            </span>

          </label>

          {/* NORMAL SIGNUP */}

          <button
            type="submit"
            className="w-full text-xl font-bold text-white bg-blue-500 py-3 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Sign Up
          </button>

          {/* DIVIDER */}

          <div className="flex items-center gap-3 my-4">

            <div className="h-px bg-gray-600 flex-1" />

            <span className="text-xs text-gray-400">
              OR SIGN UP WITH
            </span>

            <div className="h-px bg-gray-600 flex-1" />

          </div>

          {/* GOOGLE SIGNUP */}

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={() =>
                toast.error("Google signup failed"
                )
              }
              text="signup_with"
              shape="rectangular"
            />

          </div>

          {/* LOGIN */}

          <p className="text-white text-center font-bold">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-500"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Signup;