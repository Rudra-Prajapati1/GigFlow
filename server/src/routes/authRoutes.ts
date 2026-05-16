import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { registerValidation, loginValidation } from "../middleware/validate";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);
authRouter.post("/login", loginValidation, login);
authRouter.get("/me", protect, getMe);

export default authRouter;
