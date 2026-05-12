import { z } from 'zod'

export const createTagSchema = z.object({
  name: z.string().min(1, 'Nama tag tidak boleh kosong'),
  description: z.string().optional(),
})

export type CreateTagFormData = z.infer<typeof createTagSchema>

export const updateTagSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Nama tag tidak boleh kosong'),
  description: z.string().optional(),
})

export type UpdateTagFormData = z.infer<typeof updateTagSchema>

export const bulkDeleteTagSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteTagFormData = z.infer<typeof bulkDeleteTagSchema>
