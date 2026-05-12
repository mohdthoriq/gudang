import { z } from "zod";

// Skema untuk Create User Baru (Oleh Admin)
export const createUserSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter").optional(),
  role: z.enum(["SANTRI", "MENTOR", "WALI_SANTRI"]),
});

// Skema untuk Update User (Semua field opsional, abaikan password)
export const updateUserSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter").optional(),
  role: z.enum(["SANTRI", "MENTOR", "WALI_SANTRI"]).optional(),
});

export type ICreateUserData = z.infer<typeof createUserSchema>;
export type IUpdateUserData = z.infer<typeof updateUserSchema>;
