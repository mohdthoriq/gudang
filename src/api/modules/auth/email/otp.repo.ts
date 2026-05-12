import { prisma } from "../../../config/prisma.js"

export const verifyOtp = async (userId: string, otp: string) => {
    return await prisma.verification.findUnique({
        where: {
            user_id_otpCode: {
                user_id: userId,
                otpCode: otp,
            }
        },
    });
}

export const createOtp = async (userId: string, otp: string) => {
    return await prisma.verification.create({
        data: {
            user_id: userId,
            otpCode: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
}

