import express from "express";

import { generateQuestions } from "../controller/interview.controller.js";
import { evaluateInterview } from "../controller/interview.controller.js";
import { getInterviewHistory } from "../controller/interview.controller.js";
import { testGemini } from "../controller/gemini.controller.js";

const router = express.Router();

router.post("/start",generateQuestions);
router.post( "/evaluate",evaluateInterview);
router.get("/history", getInterviewHistory);
router.get("/test", testGemini);


export default router;