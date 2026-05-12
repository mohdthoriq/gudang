import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    nis: z.string().optional(),
    password: z.string().min(6, "Password minimal 6 karakter"),
    phone: z.string().min(10, "Nomor telepon minimal 10 karakter"),
    role: z.enum(["SANTRI", "MENTOR", "WALI_SANTRI"]),
});

export type IRegisterData = z.infer<typeof registerSchema>;