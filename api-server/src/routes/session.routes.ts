import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllSessionsForUser,
  deleteSessionById,
  deleteAllSessions,
  deactivateSessionById,
  getSessionById,
} from "../controllers/session.controller";

const router = Router();

// All routes below require authentication
router.use(authMiddleware);

// GET /api/sessions - List all sessions for the current user
router.get("/", getAllSessionsForUser);

// GET /api/sessions/:id - Get a specific session by ID
router.get("/:id", getSessionById);

// DELETE /api/sessions/:id - Delete a specific session by ID
router.delete("/:id", deleteSessionById);

// DELETE /api/sessions - Delete all sessions for the user (logout everywhere)
router.delete("/", deleteAllSessions);

// PATCH /api/sessions/:id/deactivate - Deactivate a specific session
router.patch("/:id/deactivate", deactivateSessionById);

export default router;
