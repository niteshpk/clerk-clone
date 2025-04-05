import { Request, Response } from "express";
import Session from "../models/session.model";

/**
 * GET /api/sessions
 * List all sessions for the current user
 */
export const getAllSessionsForUser = async (_req: Request, res: Response) => {
  try {
    const sessions = await Session.find({ user: res.locals.userId }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

/**
 * DELETE /api/sessions/:id
 * Delete a specific session by ID (if it belongs to the current user)
 */
export const deleteSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findOneAndDelete({
      _id: id,
      user: res.locals.userId,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }

    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

/**
 * DELETE /api/sessions
 * Delete all sessions for the current user (logout from everywhere)
 */
export const deleteAllSessions = async (_req: Request, res: Response) => {
  try {
    await Session.deleteMany({ user: res.locals.userId });
    res.status(200).json({ message: "All sessions deleted" });
  } catch (error) {
    console.error("Error deleting all sessions:", error);
    res.status(500).json({ message: "Failed to delete sessions" });
  }
};
