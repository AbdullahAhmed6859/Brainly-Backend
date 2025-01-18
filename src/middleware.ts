import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./auth";

export function protect(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ message: "Authorization token missing" });
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(403).json({
      message: "Authentication failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
