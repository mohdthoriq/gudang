import { z } from 'zod'

export const createProductCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori harus diisi'),
  description: z.string().optional(),
})

export type CreateProductCategoryFormData = z.infer<
  typeof createProductCategorySchema
>

export const updateProductCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Nama kategori harus diisi'),
  description: z.string().optional(),
})

export type UpdateProductCategoryFormData = z.infer<
  typeof updateProductCategorySchema
>

export const deleteProductCategorySchema = z.object({
  id: z.uuid(),
})

export type DeleteProductCategoryFormData = z.infer<
  typeof deleteProductCategorySchema
>

export const bulkDeleteProductCategorySchema = z.object({
  ids: z.array(z.uuid()).min(1, 'Pilih minimal 1 kategori untuk dihapus'),
})

export type BulkDeleteProductCategoryFormData = z.infer<
  typeof bulkDeleteProductCategorySchema
>
