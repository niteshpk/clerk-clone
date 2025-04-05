import { Router } from "express";
import {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyOTP,
  resendOTP,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// OTP routes
router.post("/otp/verify", verifyOTP);
router.post("/otp/resend", resendOTP);

// Protected routes
router.use(authMiddleware);

// GET /api/users/me - Get current user
router.get("/me", getCurrentUser);

// GET /api/users - Get all users
router.get("/", getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;
