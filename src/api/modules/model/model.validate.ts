import { z } from 'zod';

export const createModelSchema = z.object({
  name: z.string().min(2, "Nama model minimal 2 karakter"),
  groupId: z.string().uuid().min(1, "Group ID wajib diisi"),
});

export const updateModelSchema = createModelSchema.partial();

export const bulkDeleteModelSchema = z.object({
  ids: z.array(z.string()).min(1, "Minimal pilih 1 ID untuk dihapus"),
});

export const queryModelSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  groupId: z.string().uuid().min(1, "Group ID wajib diisi"), // Opsional: untuk filter model berdasarkan grup tertentu
});

export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type QueryModelInput = z.infer<typeof queryModelSchema>;
export type BulkDeleteModelInput = z.infer<typeof bulkDeleteModelSchema>;
