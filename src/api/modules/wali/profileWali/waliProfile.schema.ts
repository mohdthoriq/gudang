import { z } from 'zod';

export const createWaliProfileSchema = z.object({
  userId: z.string().uuid("User ID wajib diisi dan harus berupa UUID"),
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  photoUrl: z.string().nullish(),
});

export const updateWaliProfileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  photoUrl: z.string().nullish(),
});

export type ICreateWaliProfile = z.infer<typeof createWaliProfileSchema>;
export type IUpdateWaliProfile = z.infer<typeof updateWaliProfileSchema>;
