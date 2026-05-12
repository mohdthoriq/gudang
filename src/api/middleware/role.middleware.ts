import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user; 

    if (!user) {
      return errorResponse(res, "Unauthorized. Silakan login terlebih dahulu.", 401);
    }

    // Sesuaikan "ADMIN" dengan nama enum di Prisma kamu
    if (user.role !== "ADMIN") {
      return errorResponse(res, "Forbidden. Akses ditolak, khusus Admin.", 403);
    }

    // Jika lolos, lanjut ke controller
    next();
  } catch (error: any) {
    return errorResponse(res, "Terjadi kesalahan pada verifikasi akses.", 500);
  }
};


export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return errorResponse(res, "Unauthorized. Silakan login terlebih dahulu.", 401);
      }

      // Mengecek apakah role user saat ini ada di dalam daftar role yang diizinkan
      if (!allowedRoles.includes(user.role)) {
        return errorResponse(res, `Forbidden. Role ${user.role} tidak memiliki akses ke resource ini.`, 403);
      }

      next();
    } catch (error: any) {
      return errorResponse(res, "Terjadi kesalahan pada verifikasi akses.", 500);
    }
  };
};