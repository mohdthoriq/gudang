import { z } from 'zod'

export const createPlanSchema = z.object({
  code: z.string().min(1, 'Kode plan wajib diisi'),
  name: z.string().min(1, 'Nama plan wajib diisi'),
  monthly_price: z.number().nonnegative('Harga bulanan tidak boleh negatif'),
  yearly_price: z.number().nonnegative('Harga tahunan tidak boleh negatif'),
  description: z.string().optional(),
  features: z.array(z.string()).min(1, 'Fitur minimal 1'),
  is_active: z.boolean().optional(),
})

export type CreatePlanFormData = z.infer<typeof createPlanSchema>

export const updatePlanSchema = z.object({
  id: z.uuid(),
  code: z.string().min(1, 'Kode plan wajib diisi'),
  name: z.string().min(1, 'Nama plan wajib diisi'),
  monthly_price: z.number().nonnegative('Harga bulanan tidak boleh negatif'),
  yearly_price: z.number().nonnegative('Harga tahunan tidak boleh negatif'),
  description: z.string().optional(),
  features: z.array(z.string()).min(1, 'Fitur minimal 1'),
  is_active: z.boolean().optional(),
})

export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>

export const deletePlanSchema = z.object({
  id: z.uuid(),
})

export type DeletePlanFormData = z.infer<typeof deletePlanSchema>

export const bulkDeletePlanSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeletePlanFormData = z.infer<typeof bulkDeletePlanSchema>
