import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Session from "../models/session.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const session = await Session.findById(payload.sessionId);
    if (!session) throw new Error();
    res.locals.sessionId = session._id;
    res.locals.userId = session.user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid session" });
  }
};
