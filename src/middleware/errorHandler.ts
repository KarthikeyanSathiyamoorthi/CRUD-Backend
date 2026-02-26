import { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode?: number;
  code?: number; // MongoDB duplicate key
  keyValue?: Record<string, string>; // MongoDB duplicate key field
  errors?: Record<string, { message: string }>; // MongoDB validation errors
  path?: string; // MongoDB CastError
  value?: string; // MongoDB CastError
  stack?: string; // Error stack trace
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists`;
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = errors.join(",");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = `Invalid token`;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // MongoDB CastError (Invalid ID)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR: ", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
export {};
