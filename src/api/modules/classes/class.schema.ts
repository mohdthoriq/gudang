import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().min(2, "Nama kelas minimal 2 karakter"),
  divisiId: z.string().uuid("divisiId harus berupa UUID yang valid"),
  mentorId: z.string().uuid("mentorId harus berupa UUID yang valid"),
});

export const updateClassSchema = z.object({
  name: z.string().min(2, "Nama kelas minimal 2 karakter").optional(),
  divisiId: z.string().uuid("divisiId harus berupa UUID yang valid").optional(),
  mentorId: z.string().uuid("mentorId harus berupa UUID yang valid").optional(),
});

export type ICreateClassData = z.infer<typeof createClassSchema>;
export type IUpdateClassData = z.infer<typeof updateClassSchema>;
