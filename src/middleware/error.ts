import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        const firstError = err.issues[0];
        const message = firstError?.message || "Validation error";
        const status = 400;
        console.error("Validation error:", message);
        return res.status(status).json({ success: false, error: message });
    }
    if (err instanceof Error) {
        const message = err.message || "Internal server error";
        const status = 500;
        console.error("Error:", message);
        return res.status(status).json({ success: false, error: message });
    }
    next(err);
};