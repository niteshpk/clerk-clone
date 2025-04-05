import { Request, Response } from "express";
import Session from "../models/session.model";
import { ApiResponseBuilder } from "../types/api-response";
import { transformDocument } from "../utils/transform";

/**
 * GET /api/sessions
 * List all sessions for the current user
 */
export const getAllSessionsForUser = async (req: Request, res: Response) => {
  try {
    const sessions = await Session.find({ user: res.locals.userId })
      .sort({ created_at: -1 })
      .select("-__v");

    const transformedSessions = sessions.map((session) =>
      transformDocument(session.toObject())
    );

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Sessions retrieved successfully",
        { sessions: transformedSessions },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to fetch sessions",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * DELETE /api/sessions/:id
 * Delete a specific session by ID (if it belongs to the current user)
 */
export const deleteSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentSessionId = res.locals.sessionId.toString();

    // Prevent deletion of current session
    if (id === currentSessionId) {
      return ApiResponseBuilder.send(
        res,
        400,
        ApiResponseBuilder.error(
          "Cannot delete current session",
          {
            code: "INVALID_OPERATION",
            details:
              "You cannot delete your current active session. Please use the logout endpoint instead.",
          },
          req.requestId
        )
      );
    }

    const session = await Session.findOneAndDelete({
      _id: id,
      user: res.locals.userId,
    });

    if (!session) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Session not found or unauthorized",
          {
            code: "SESSION_NOT_FOUND",
            details:
              "The requested session does not exist or you don't have permission to delete it",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Session deleted successfully",
        { sessionId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete session",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * DELETE /api/sessions
 * Delete all sessions for the current user (logout from everywhere)
 */
export const deleteAllSessions = async (req: Request, res: Response) => {
  try {
    await Session.deleteMany({ user: res.locals.userId });

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "All sessions deleted successfully",
        undefined,
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error deleting all sessions:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to delete sessions",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * PATCH /api/sessions/:id/deactivate
 * Deactivate a specific session by ID (if it belongs to the current user)
 */
export const deactivateSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findOneAndUpdate(
      {
        _id: id,
        user: res.locals.userId,
      },
      { is_active: false },
      { new: true }
    );

    if (!session) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Session not found or unauthorized",
          {
            code: "SESSION_NOT_FOUND",
            details:
              "The requested session does not exist or you don't have permission to deactivate it",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Session deactivated successfully",
        { sessionId: id },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error deactivating session:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to deactivate session",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};

/**
 * GET /api/sessions/:id
 * Get a specific session by ID
 */
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({
      _id: id,
      user: res.locals.userId,
    });

    if (!session) {
      return ApiResponseBuilder.send(
        res,
        404,
        ApiResponseBuilder.error(
          "Session not found or unauthorized",
          {
            code: "SESSION_NOT_FOUND",
            details:
              "The requested session does not exist or you don't have permission to access it",
          },
          req.requestId
        )
      );
    }

    const transformedSession = transformDocument(session.toObject());
    return ApiResponseBuilder.send(
      res,
      200,
      ApiResponseBuilder.success(
        "Session retrieved successfully",
        { session: transformedSession },
        undefined,
        req.requestId
      )
    );
  } catch (error) {
    console.error("Error fetching session:", error);
    return ApiResponseBuilder.send(
      res,
      500,
      ApiResponseBuilder.internalError(
        "Failed to fetch session",
        error instanceof Error ? error.message : undefined,
        req.requestId
      )
    );
  }
};
