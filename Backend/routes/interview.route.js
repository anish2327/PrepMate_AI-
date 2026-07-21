import express from "express";

import { generateQuestions } from "../controller/interview.controller.js";
import { evaluateInterview } from "../controller/interview.controller.js";
import { getInterviewHistory } from "../controller/interview.controller.js";
import { testGemini } from "../controller/gemini.controller.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post("/start", 
    upload.single("resume"), 
    generateQuestions
);

router.post( "/evaluate",evaluateInterview);
router.get("/history", getInterviewHistory);
router.get("/test", testGemini);


export default router;