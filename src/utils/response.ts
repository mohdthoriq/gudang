// src/utils/response.ts
import { NextResponse } from "next/server";

// Format untuk respons sukses
export function successResponse<T>(
  message: string,
  data?: T,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data !== undefined && { data }), // Akan dikirim hanya jika ada datanya
    },
    { status: statusCode }
  );
}

// Format untuk respons error
export function errorResponse(
  message: string,
  errors?: unknown,
  statusCode: number = 400
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors !== undefined && { errors }), // Akan dikirim hanya jika ada detail error
    },
    { status: statusCode }
  );
}
