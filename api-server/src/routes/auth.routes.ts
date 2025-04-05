import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

export default router;
