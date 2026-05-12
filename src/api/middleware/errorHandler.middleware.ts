import type { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err.message, err.stack);

  // Status default
  let statusCode = 500;
  let message = "Terjadi kesalahan server";

  // Jika error punya statusCode
  if (err.statusCode && typeof err.statusCode === "number") {
    statusCode = err.statusCode;
  }

  // Jika error punya message
  if (err.message) {
    message = err.message;
  }

  if (message.includes("tidak ditemukan") || message.toLowerCase().includes("not found")) {
    statusCode = 404;
  } else if (message.includes("sudah ada") || message.toLowerCase().includes("already exists")) {
    statusCode = 409;
  }


  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

