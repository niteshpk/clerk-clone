import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
