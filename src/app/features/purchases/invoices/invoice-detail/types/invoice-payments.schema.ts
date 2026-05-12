import { z } from 'zod'

export const invoicePaymentsSchema = z.object({
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  reference_no: z.string().optional(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  purchase_invoice_id: z.uuid(),
})

export type InvoicePaymentsFormData = z.infer<typeof invoicePaymentsSchema>

export const deletePurchasesInvoiceSchema = z.object({
  ids: z.array(z.uuid()),
})

export type DeletePurchasesInvoiceFormData = z.infer<
  typeof deletePurchasesInvoiceSchema
>

export const updateInvoicePaymentsSchema = z.object({
  id: z.uuid(),
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  reference_no: z.string().optional(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  purchase_invoice_id: z.uuid(),
})

export type UpdateInvoicePaymentsFormData = z.infer<
  typeof updateInvoicePaymentsSchema
>
