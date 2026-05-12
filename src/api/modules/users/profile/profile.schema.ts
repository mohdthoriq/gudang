import { z } from 'zod';

// Skema untuk Query Pagination
export const paginationQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
});

// Skema untuk Create User Baru (Admin)
export const createProfileSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter").optional(),
  role: z.enum(["SANTRI", "MENTOR", "WALI_SANTRI"]),
  photoUrl: z.string().nullish(),
  address: z.string().nullish(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir YYYY-MM-DD").nullish(),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]).nullish(),
});

// Skema untuk Update (Semuanya opsional karena bisa jadi cuma update nama)
export const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter").optional(),
  role: z.enum(["SANTRI", "MENTOR", "WALI_SANTRI"]).optional(),
  photoUrl: z.string().nullish(),
  address: z.string().nullish(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir YYYY-MM-DD").nullish(),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]).nullish(),
});

export type ICreateProfileData = z.infer<typeof createProfileSchema>;
export type IUpdateProfileData = z.infer<typeof updateProfileSchema>;
