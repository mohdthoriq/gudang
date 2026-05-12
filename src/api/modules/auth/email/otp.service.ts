import { AppError } from "../../../appErr.js";
import { prisma } from "../../../config/prisma.js";
import { sendEmail } from "../../../utils/brevo.js";
import { createOtp, verifyOtp } from "./otp.repo.js";

export const verifyOtpService = async (userId: string, otp: string) => {
    const result = await verifyOtp(userId, otp);
    if (!result) {
        throw new AppError("Invalid OTP", 400);
    }

    if (result.expiresAt < new Date()) {
        throw new AppError("OTP has expired", 400);
    }
    await prisma.verification.delete({
      where: {id: result.id}
    })
    return result;
}

export const createOtpService = async (userId: string, otp: string) => {
    await prisma.verification.deleteMany({
        where: {
            user_id: userId,
        },
    });
    return await createOtp(userId, otp);
}

export const resendOtpService = async (userId: string, email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await createOtpService(userId, otp);
    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; text-align: center;">
        
        <h2 style="color: #333;">Verify Your Email</h2>
        
        <p style="color: #555; font-size: 14px;">
          Use the OTP below to verify your account
        </p>

        <div style="margin: 20px 0;">
          <span style="
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 24px;
            font-size: 20px;
            letter-spacing: 4px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #999; font-size: 12px;">
          This OTP is valid for a limited time. Do not share it with anyone.
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa;">
          If you didn’t request this, you can ignore this email.
        </p>

      </div>
    </div>
  `,
  textContent: "selamat datang"
    });
    return otp;
}