import bcrypt from "bcrypt";
import { findByIdRepo, loginRepo } from "./login.repo.js";
import type { ILoginData } from "./login.schema.js";
import jwt from "jsonwebtoken";
import { AppError } from "../../../appErr.js";
import { config } from "../../../utils/env.js";

export const loginService = async (data: ILoginData) => {
  // 1. Destrukturisasi data dari input
  const { email, password } = data;

  // 2. PERBAIKAN: Cukup panggil Repo dengan mengirimkan email saja
  // Asumsi: loginRepo mencari data user (findUnique) berdasarkan email
  const user = await loginRepo({ email, password });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 3. Validasi Hash Password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 400);
  }
  const secretKey = config.JWT_SECRET;
  const refreshTokenSecret = config.REFRESH_TOKEN;
  console.log(secretKey, refreshTokenSecret);
  if (!secretKey || !refreshTokenSecret) {
    throw new AppError("JWT secret or refresh token secret is not defined", 500);
  }

  // 4. PERBAIKAN: Tambahkan "!" pada process.env.JWT_SECRET
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: user.id, role: user.role }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  // 5. Kembalikan data yang bersih (tanpa password)
  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN!) as { id: string };
  const user = await findByIdRepo(decoded.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const newToken = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET!, {
    expiresIn: "1h",
  });
  return {
    token: newToken,
  };
};

