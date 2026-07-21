import { Router } from 'express';
import { registerUser, loginUser } from "../controller/user.controller.js";
import { googleLoginController } from "../controller/user.controller.js";
import { logoutController } from "../controller/user.controller.js";
import authMiddleware from '../middleware/auth.js';

import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLoginController);
userRouter.post(
  "/logout",
  logoutController
);


export default userRouter;
