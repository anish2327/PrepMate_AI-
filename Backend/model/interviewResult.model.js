import mongoose from "mongoose";

const interviewResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: String,

    experience: String,

    score: Number,

    feedback: String,

    strengths: [String],

    weaknesses: [String],
  },
  {
    timestamps: true,
  }
);

const InterviewResult = mongoose.model(
  "InterviewResult",
  interviewResultSchema
);

export default InterviewResult;