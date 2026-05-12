import { z } from 'zod'

export const invoicePaymentsSchema = z.object({
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  reference_no: z.string().optional(),
  note: z.string().optional(),
  tags: z.array(z.uuid()).optional(),
  sales_invoice_id: z.uuid(),
})

export type InvoicePaymentsFormData = z.infer<typeof invoicePaymentsSchema>

export const deleteSalesInvoiceSchema = z.object({
  ids: z.array(z.uuid()).min(1, 'Pilih minimal satu invoice'),
})

export type DeleteSalesInvoiceFormData = z.infer<
  typeof deleteSalesInvoiceSchema
>

export const updateInvoicePaymentsSchema = z.object({
  id: z.uuid(),
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  reference_no: z.string().optional(),
  note: z.string().optional(),
  tags: z.array(z.uuid()).optional(),
  sales_invoice_id: z.uuid(),
})

export type UpdateInvoicePaymentsFormData = z.infer<
  typeof updateInvoicePaymentsSchema
>
