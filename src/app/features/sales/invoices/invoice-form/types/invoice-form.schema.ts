import { z } from 'zod'

export const invoiceItemSchema = z.object({
  product_id: z.string().min(1, 'Produk tidak boleh kosong'),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit_price: z.number().positive(),
  tax_id: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  line_total: z.number().positive(),
})

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>

export const invoiceItemUpdateSchema = z.object({
  id: z.uuid('ID item tidak boleh kosong').optional().nullable(),
  product_id: z.string().min(1, 'Produk tidak boleh kosong'),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  tax_id: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  line_total: z.number().positive(),
})

export type InvoiceItemUpdateFormData = z.infer<typeof invoiceItemUpdateSchema>

export enum UnitsType {
  percent = 'percent',
  fixed = 'fixed',
}

export const additionalDiscount = z.object({
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const updateAdditionalDiscount = z.object({
  id: z.uuid().optional().nullable(),
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const deductions = z.object({
  account_id: z.string().min(1, 'Akun tidak boleh kosong'),
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const updateDeductions = z.object({
  id: z.uuid().optional().nullable(),
  account_id: z.string().min(1, 'Akun tidak boleh kosong'),
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const transactionFee = z.object({
  name: z.string().optional(),
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const updateTransactionFee = z.object({
  id: z.uuid().optional().nullable(),
  name: z.string().optional(),
  type: z.enum(UnitsType),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export const CreateInvoiceSchema = z
  .object({
    customer_id: z.string().min(1, 'Pelanggan tidak boleh kosong'),
    payment_term_id: z.string().optional(),
    invoice_number: z.string().min(1, 'Nomor invoice tidak boleh kosong'),
    invoice_date: z.date(),
    due_date: z.date(),
    currency: z.string().min(1, 'Mata uang tidak boleh kosong'),
    subtotal: z.number().nonnegative(),
    tax_total: z.number(),
    total: z.number().nonnegative(),
    payment_status: z.enum(['unpaid', 'partially_paid', 'paid']),
    sales_invoice_items: z
      .array(invoiceItemSchema)
      .min(1, 'Invoice harus memiliki minimal 1 item'),
    tags: z.array(z.uuid()).nullable(),
    additional_discounts: z.array(additionalDiscount).optional(),
    deductions: z.array(deductions).optional(),
    is_tax_inclusive: z.boolean(),
    transaction_fees: z.array(transactionFee).optional(),
    shipping_fee: z.number().nonnegative().optional().nullable(),
    shipping_date: z.date().optional().nullable(),
    expedition_id: z.string().optional().nullable(),
    tracking_number: z.string().optional().nullable(),
    images: z.any().array().optional(),
    note: z.string().optional().nullable(),
  })
  .refine((data) => data.invoice_date <= data.due_date, {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal invoice',
    path: ['due_date'],
  })

export type CreateInvoiceFormData = z.infer<typeof CreateInvoiceSchema>

export const UpdateInvoiceSchema = z
  .object({
    id: z.uuid().min(1, 'ID invoice tidak boleh kosong'),
    customer_id: z.string().min(1, 'Pelanggan tidak boleh kosong'),
    payment_term_id: z.string().optional(),
    invoice_number: z.string().min(1, 'Nomor invoice tidak boleh kosong'),
    invoice_date: z.date(),
    due_date: z.date(),
    currency: z.string().min(1, 'Mata uang tidak boleh kosong'),
    subtotal: z.number().nonnegative(),
    tax_total: z.number(),
    total: z.number().nonnegative(),
    payment_status: z.enum(['unpaid', 'partially_paid', 'paid']),
    sales_invoice_items: z
      .array(invoiceItemUpdateSchema)
      .min(1, 'Invoice harus memiliki minimal 1 item'),
    tags: z.array(z.uuid()).nullable(),
    additional_discounts: z.array(updateAdditionalDiscount).optional(),
    deductions: z.array(updateDeductions).optional(),
    is_tax_inclusive: z.boolean(),
    transaction_fees: z.array(updateTransactionFee).optional(),
    shipping_fee: z.number().nonnegative().optional().nullable(),
    shipping_date: z.date().optional().nullable(),
    expedition_id: z.string().optional().nullable(),
    tracking_number: z.string().optional().nullable(),
    images: z.any().array().optional(),
    note: z.string().optional().nullable(),
  })
  .refine((data) => data.invoice_date <= data.due_date, {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal invoice',
    path: ['due_date'],
  })

export type UpdateInvoiceFormData = z.infer<typeof UpdateInvoiceSchema>
