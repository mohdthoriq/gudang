// src/lib/api-wrapper.ts
import { z } from "zod";
import { errorResponse } from "../utils/response";

export function apiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      // 1. Tangkap Error Validasi Zod
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        return errorResponse("Validasi Gagal", formattedErrors, 400);
      }

      if (error instanceof Error) {
        return errorResponse(error.message, null, 400);
      }

      return errorResponse("Terjadi kesalahan internal server.", null, 500);
    }
  };
}
