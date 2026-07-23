

import userModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";


// ==========================================
// REGISTER USER
// ==========================================

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide all required details",
        error: true,
        success: false,
      });
    }

    // Check existing user
    const existingUser = await userModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);

    const hashedPassword =
      await bcryptjs.hash(password, salt);

    // Create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,

      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
        },
      },
    });

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Something went wrong",
      error: true,
      success: false,
    });
  }
}


// ==========================================
// GOOGLE LOGIN
// ==========================================

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);
console.log("Backend Client ID:", process.env.GOOGLE_CLIENT_ID);

export async function googleLoginController(
  req,
  res
) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token missing",
        error: true,
        success: false,
      });
    }
    console.log("Expected Client ID:", process.env.GOOGLE_CLIENT_ID);

  const decoded = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  console.log("Token Audience:", decoded.aud);
  console.log("Token Issuer:", decoded.iss);

    // Verify Google token
    const ticket =
      await client.verifyIdToken({
        idToken: token,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const {
      email,
      given_name,
      family_name,
      picture,
    } = payload;

    // Find user
    let user =
      await userModel.findOne({
        email,
      });

    // Create user if not found
    if (!user) {
      const fullName =
        `${given_name || ""} ${
          family_name || ""
        }`.trim();

      user = await userModel.create({
        name: fullName,
        email,
        image: picture || "",
        authProvider: "google",
      });
    }

    // Generate JWT tokens
    const accessToken =
      await generatedAccessToken(
        user._id
      );

    const refreshToken =
      await generatedRefreshToken(
        user._id
      );

    // Update login date
    await userModel.findByIdAndUpdate(
      user._id,
      {
        last_login_date: new Date(),
      }
    );

    // Cookie configuration
    const cookiesOption = {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
    };

    res.cookie(
      "accessToken",
      accessToken,
      cookiesOption
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      cookiesOption
    );

    return res.status(200).json({
      message:
        "Google login successfully",
      error: false,
      success: true,

      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },

        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Google login failed",
      error: true,
      success: false,
    });
  }
}


// ==========================================
// NORMAL LOGIN
// ==========================================

export async function loginUser(
  req,
  res
) {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Provide email and password",
        error: true,
        success: false,
      });
    }

    // Find user
    const user =
      await userModel.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        message:
          "User is not registered",
        error: true,
        success: false,
      });
    }

    // Handle Google-only users
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google login. Please continue with Google.",
        error: true,
        success: false,
      });
    }

    // Verify password
    const checkPassword =
      await bcryptjs.compare(
        password,
        user.password
      );

    if (!checkPassword) {
      return res.status(400).json({
        message:
          "Password is incorrect",
        error: true,
        success: false,
      });
    }

    // Generate JWT tokens
    const accessToken =
      await generatedAccessToken(
        user._id
      );

    const refreshToken =
      await generatedRefreshToken(
        user._id
      );

    // Update last login
    await userModel.findByIdAndUpdate(
      user._id,
      {
        last_login_date: new Date(),
      }
    );

    const cookiesOption = {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
    };

    res.cookie(
      "accessToken",
      accessToken,
      cookiesOption
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      cookiesOption
    );

    return res.status(200).json({
      message: "Login successfully",
      error: false,
      success: true,

      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
        },

        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Login failed",
      error: true,
      success: false,
    });
  }
}


export async function logoutController(req, res) {
  try {
    const userId = req.userId;

    const cookiesOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    };

    // Clear cookies
    res.clearCookie(
      "accessToken",
      cookiesOption
    );

    res.clearCookie(
      "refreshToken",
      cookiesOption
    );

    // Clear refresh token from database
    if (userId) {
      await userModel.findByIdAndUpdate(
        userId,
        {
          refresh_token: "",
        }
      );
    }

    return res.status(200).json({
      message: "Logout successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error(
      "Logout Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Logout failed",
      error: true,
      success: false,
    });
  }
}