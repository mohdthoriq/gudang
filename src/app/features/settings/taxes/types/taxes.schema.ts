import { z } from 'zod'

export const createTaxesSchema = z.object({
  name: z.string().min(1, 'Nama pajak harus diisi'),
  rate: z.number().min(0, 'Rate tidak boleh negatif'),
  description: z.string().optional(),
  company_id: z.string().min(1, 'Company ID harus diisi'),
  is_withholding: z.boolean(),
  buy_account_id: z.uuid(),
  sell_account_id: z.uuid(),
  is_active: z.boolean(),
})

export type CreateTaxesFormData = z.infer<typeof createTaxesSchema>

export const updateTaxesSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Nama pajak harus diisi'),
  description: z.string().optional(),
  rate: z.number().min(0, 'Rate tidak boleh negatif'),
  is_withholding: z.boolean(),
  buy_account_id: z.uuid(),
  sell_account_id: z.uuid(),
  is_active: z.boolean(),
})

export type UpdateTaxesFormData = z.infer<typeof updateTaxesSchema>

export const updateTaxStatusSchema = z.object({
  id: z.uuid(),
  is_active: z.boolean(),
})

export type UpdateTaxStatusFormData = z.infer<typeof updateTaxStatusSchema>

export const deleteTaxesSchema = z.object({
  id: z.uuid(),
})

export type DeleteTaxesFormData = z.infer<typeof deleteTaxesSchema>

export const bulkDeleteTaxesSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteTaxesFormData = z.infer<typeof bulkDeleteTaxesSchema>
