import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate a unique request ID
  const requestId = uuidv4();

  // Add request ID to request object
  req.requestId = requestId;

  // Add request ID to response headers
  res.setHeader("X-Request-ID", requestId);

  next();
};
