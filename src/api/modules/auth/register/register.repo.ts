import { prisma } from "../../../config/prisma.js";
import type { IRegisterData } from "./register.schema.js";

export const checkEmailRepo = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const registerRepo = async (data: IRegisterData) => {
  return await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      nis: data.nis ?? null,
      phone: data.phone ?? null,
      role: data.role,
    },
  });
};

export const getNisSantri = async (prefix: string) => {
  return await prisma.user.findFirst({
    where: {
      nis: {
        startsWith: prefix,
      },
    },
    orderBy: {
      nis: "desc",
    },
  });
}