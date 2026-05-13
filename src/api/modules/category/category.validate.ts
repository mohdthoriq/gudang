import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
});

export const updateCategorySchema = createCategorySchema.partial();

export const bulkDeleteCategorySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Minimal pilih 1 ID untuk dihapus"),
});

export const queryCategorySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type BulkDeleteCategoryInput = z.infer<typeof bulkDeleteCategorySchema>;
