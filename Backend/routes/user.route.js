import { Router } from 'express';
import { registerUser, loginUser } from "../controller/user.controller.js";

import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
