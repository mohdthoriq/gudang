import { z } from 'zod'

export const createUnitSchema = z.object({
  name: z.string().min(1, 'Nama satuan tidak boleh kosong'),
  code: z.string().min(1, 'Kode satuan tidak boleh kosong'),
  company_id: z.string(),
})

export type CreateUnitFormData = z.infer<typeof createUnitSchema>

export const updateUnitSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Nama satuan tidak boleh kosong'),
  code: z.string().min(1, 'Kode satuan tidak boleh kosong'),
})

export type UpdateUnitFormData = z.infer<typeof updateUnitSchema>

export const bulkDeleteUnitSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteUnitFormData = z.infer<typeof bulkDeleteUnitSchema>
