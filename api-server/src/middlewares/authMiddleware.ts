import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Session from "../models/session.model";
import { ApiResponseBuilder } from "../types/api-response";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return ApiResponseBuilder.send(
      res,
      401,
      ApiResponseBuilder.error(
        "Unauthorized",
        {
          code: "MISSING_TOKEN",
          details:
            "Authorization token is required. Please provide a valid Bearer token.",
        },
        req.requestId
      )
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const session = await Session.findById(payload.sessionId);

    if (!session) {
      return ApiResponseBuilder.send(
        res,
        401,
        ApiResponseBuilder.error(
          "Invalid session",
          {
            code: "INVALID_SESSION",
            details:
              "Your session has expired or is invalid. Please login again.",
          },
          req.requestId
        )
      );
    }

    res.locals.sessionId = session._id;
    res.locals.userId = session.user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponseBuilder.send(
        res,
        401,
        ApiResponseBuilder.error(
          "Token expired",
          {
            code: "TOKEN_EXPIRED",
            details: "Your session has expired. Please login again.",
          },
          req.requestId
        )
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return ApiResponseBuilder.send(
        res,
        401,
        ApiResponseBuilder.error(
          "Invalid token",
          {
            code: "INVALID_TOKEN",
            details: "The provided token is invalid. Please login again.",
          },
          req.requestId
        )
      );
    }

    return ApiResponseBuilder.send(
      res,
      401,
      ApiResponseBuilder.error(
        "Authentication failed",
        {
          code: "AUTH_FAILED",
          details: "An error occurred during authentication. Please try again.",
        },
        req.requestId
      )
    );
  }
};
