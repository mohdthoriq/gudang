import { z } from 'zod';

export const createVariantSchema = z.object({
  modelId: z.string().uuid().min(1, "Model ID wajib diisi"),
  color: z.string().min(1, "Warna wajib diisi"),
  size: z.string().min(1, "Ukuran wajib diisi"),
  stock: z.number().int().min(0, "Stok tidak boleh minus").default(0),
  sku: z.string().optional().nullable(),
});

export const updateVariantSchema = createVariantSchema.partial();

export const bulkDeleteVariantSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "Minimal pilih 1 ID untuk dihapus"),
});

export const queryVariantSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  modelId: z.string().uuid().min(1, "Model ID wajib diisi"),
});

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type BulkDeleteVariantInput = z.infer<typeof bulkDeleteVariantSchema>;
