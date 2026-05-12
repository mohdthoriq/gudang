import { z } from 'zod'

export const transactionTypeSchema = z.object({
  name: z.string().min(1, { message: 'Nama wajib diisi' }),
  code: z.string().min(1, { message: 'Kode wajib diisi' }),
  description: z.string().optional(),
})

export type TransactionTypeFormValues = z.infer<typeof transactionTypeSchema>

export const deleteTransactionTypeSchema = z.object({
  id: z.uuid(),
})

export type DeleteTransactionTypeFormData = z.infer<
  typeof deleteTransactionTypeSchema
>

export const bulkDeleteTransactionTypeSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteTransactionTypeFormData = z.infer<
  typeof bulkDeleteTransactionTypeSchema
>
