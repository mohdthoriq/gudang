import { z } from 'zod'

export const createExpeditionSchema = z.object({
  name: z.string().min(1, 'Nama ekspedisi tidak boleh kosong'),
  is_active: z.boolean(),
  company_id: z.string(),
})

export type CreateExpeditionFormData = z.infer<typeof createExpeditionSchema>

export const updateExpeditionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nama ekspedisi tidak boleh kosong'),
  is_active: z.boolean(),
})

export type UpdateExpeditionFormData = z.infer<typeof updateExpeditionSchema>

export const toggleExpeditionStatusSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean(),
})

export type ToggleExpeditionStatusFormData = z.infer<typeof toggleExpeditionStatusSchema>

export const bulkDeleteExpeditionSchema = z.object({
  ids: z.array(z.string().uuid()),
})

export type BulkDeleteExpeditionFormData = z.infer<typeof bulkDeleteExpeditionSchema>
