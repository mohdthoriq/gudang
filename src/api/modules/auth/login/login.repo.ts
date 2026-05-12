import { prisma } from "../../../config/prisma.js";
import type { ILoginData } from "./login.schema.js";

export const loginRepo = async (data: ILoginData) => {
    return await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
}

export const findByIdRepo = async (id: string) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
}
