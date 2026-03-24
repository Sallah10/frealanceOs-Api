import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
};
