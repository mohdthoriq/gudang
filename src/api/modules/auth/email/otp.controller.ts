import type { Request, Response } from "express";
import { successResponse } from "../../../utils/response.js";
import { resendOtpService, verifyOtpService } from "./otp.service.js";

export const verifyOtpController = async (req: Request, res: Response) => {
    const { userId, otp } = req.body;
    await verifyOtpService(userId, otp);
    successResponse(res, "OTP verified successfully", null);
}

export const resendOtpController = async (req: Request, res: Response) => {
    const { userId, email } = req.body;
    await resendOtpService(userId, email);
    successResponse(res, "OTP resent successfully", null);
}