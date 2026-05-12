import { z } from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(2, "Nama divisi minimal 2 karakter"),
  description: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(2, "Nama divisi minimal 2 karakter").optional(),
  description: z.string().optional(),
});

export type ICreateDivisionData = z.infer<typeof createDivisionSchema>;
export type IUpdateDivisionData = z.infer<typeof updateDivisionSchema>;
