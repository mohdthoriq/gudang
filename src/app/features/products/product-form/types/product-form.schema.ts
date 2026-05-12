import { z } from 'zod'

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU harus diisi'),
  name: z.string().min(1, 'Nama harus diisi'),
  description: z.string().optional(),
  purchase_price: z.number().optional(),
  sale_price: z.number().optional(),
  taxable: z.boolean().optional().nullable(),
  unit_id: z.string().min(1, 'Satuan harus diisi'),
  product_category_id: z.string().min(1, 'Kategori harus diisi'),
  images: z.array(z.string()).optional(),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>

export const updateProductSchema = z.object({
  id: z.uuid(),
  sku: z.string().min(1, 'SKU harus diisi'),
  name: z.string().min(1, 'Nama harus diisi'),
  description: z.string().optional(),
  purchase_price: z.number().optional(),
  sale_price: z.number().optional(),
  taxable: z.boolean().optional().nullable(),
  unit_id: z.string().min(1, 'Satuan harus diisi'),
  product_category_id: z.string().min(1, 'Kategori harus diisi'),
  images: z.array(z.string()).optional(),
})

export type UpdateProductFormData = z.infer<typeof updateProductSchema>
