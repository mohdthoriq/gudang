import { z } from 'zod'

export const createPaymentTermsSchema = z.object({
  name: z.string(),
  days: z.number(),
  company_id: z.string(),
})

export type CreatePaymentTermsFormData = z.infer<
  typeof createPaymentTermsSchema
>

export const updatePaymentTermsSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  days: z.number(),
})

export type UpdatePaymentTermsFormData = z.infer<
  typeof updatePaymentTermsSchema
>

export const bulkDeletePaymentTermsSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeletePaymentTermsFormData = z.infer<
  typeof bulkDeletePaymentTermsSchema
>
