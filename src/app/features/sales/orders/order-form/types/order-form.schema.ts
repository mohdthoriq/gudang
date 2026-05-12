import { z } from 'zod'
import {
  additionalDiscount,
  transactionFee,
  updateAdditionalDiscount,
  updateTransactionFee
} from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'

export const salesOrderItemSchema = z.object({
  product_id: z.string().min(1, 'Produk tidak boleh kosong'),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit_price: z.number().positive(),
  purchase_price: z.number().nonnegative().optional(),
  tax_id: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  line_total: z.number().positive(),
})

export type SalesOrderItemFormData = z.infer<typeof salesOrderItemSchema>

export const salesOrderItemUpdateSchema = z.object({
  id: z.uuid('ID item tidak boleh kosong').optional().nullable(),
  product_id: z.string().min(1, 'Produk tidak boleh kosong'),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  purchase_price: z.number().nonnegative().optional(),
  tax_id: z.string().optional(),
  discount: z.number().nonnegative().optional(),
  line_total: z.number().positive(),
})

export type SalesOrderItemUpdateFormData = z.infer<
  typeof salesOrderItemUpdateSchema
>

export const CreateSalesOrderSchema = z
  .object({
    customer_id: z.string().min(1, 'Pelanggan tidak boleh kosong'),
    shift_id: z.string().optional().nullable(),
    payment_term_id: z.string().optional().nullable(),
    order_number: z.string().min(1, 'Nomor order tidak boleh kosong'),
    order_date: z.date(),
    due_date: z.date(),
    currency: z.string().min(1, 'Mata uang tidak boleh kosong'),
    subtotal: z.number().nonnegative(),
    tax_total: z.number(),
    total: z.number().nonnegative(),
    document_status: z.enum(['draft', 'posted', 'void']),
    payment_status: z.enum(['unpaid', 'partially_paid', 'paid']),
    sales_order_items: z
      .array(salesOrderItemSchema)
      .min(1, 'Order harus memiliki minimal 1 item'),
    tags: z.array(z.string()).nullable(),
    additional_discounts: z.array(additionalDiscount).optional(),
    is_tax_inclusive: z.boolean(),
    is_pos: z.boolean().optional(),
    shipping_fee: z.number().nonnegative().optional().nullable(),
    shipping_date: z.date().optional().nullable(),
    transaction_fees: z.array(transactionFee).optional(),
    expedition_id: z.string().optional().nullable(),
    tracking_number: z.string().optional().nullable(),
    dp_type: z.enum(['percent', 'fixed']).optional(),
    dp_value: z.number().nonnegative().optional(),
    dp_amount: z.number().nonnegative().optional(),
    dp_account_id: z.string().optional().nullable(),
    attachments: z.any().array().optional(),
    note: z.string().optional().nullable(),
  })
  .refine((data) => data.order_date <= data.due_date, {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal order',
    path: ['due_date'],
  })
  .refine(
    (data) => {
      let dpAmount = data.dp_value || 0
      if (data.dp_type === 'percent') {
        dpAmount = (data.total * (data.dp_value || 0)) / 100
      }
      return dpAmount <= data.total
    },
    {
      message: 'Uang muka tidak boleh melebihi total',
      path: ['dp_value'],
    }
  )

export type CreateSalesOrderFormData = z.infer<typeof CreateSalesOrderSchema>

export const UpdateSalesOrderSchema = z
  .object({
    id: z.uuid().min(1, 'ID order tidak boleh kosong'),
    customer_id: z.string().min(1, 'Pelanggan tidak boleh kosong'),
    shift_id: z.string().optional().nullable(),
    payment_term_id: z.string().optional().nullable(),
    order_number: z.string().min(1, 'Nomor order tidak boleh kosong'),
    order_date: z.date(),
    due_date: z.date(),
    currency: z.string().min(1, 'Mata uang tidak boleh kosong'),
    subtotal: z.number().nonnegative(),
    tax_total: z.number(),
    total: z.number().nonnegative(),
    document_status: z.enum(['draft', 'posted', 'void']),
    payment_status: z.enum(['unpaid', 'partially_paid', 'paid']),
    sales_order_items: z
      .array(salesOrderItemUpdateSchema)
      .min(1, 'Order harus memiliki minimal 1 item'),
    tags: z.array(z.string()).nullable(),
    additional_discounts: z.array(updateAdditionalDiscount).optional(),
    is_tax_inclusive: z.boolean(),
    is_pos: z.boolean().optional(),
    shipping_fee: z.number().nonnegative().optional().nullable(),
    shipping_date: z.date().optional().nullable(),
    transaction_fees: z.array(updateTransactionFee).optional(),
    expedition_id: z.string().optional().nullable(),
    tracking_number: z.string().optional().nullable(),
    dp_type: z.enum(['percent', 'fixed']).optional(),
    dp_value: z.number().nonnegative().optional(),
    dp_amount: z.number().nonnegative().optional(),
    dp_account_id: z.string().optional().nullable(),
    attachments: z.any().array().optional(),
    note: z.string().optional().nullable(),
  })
  .refine((data) => data.order_date <= data.due_date, {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal order',
    path: ['due_date'],
  })
  .refine(
    (data) => {
      let dpAmount = data.dp_value || 0
      if (data.dp_type === 'percent') {
        dpAmount = (data.total * (data.dp_value || 0)) / 100
      }
      return dpAmount <= data.total
    },
    {
      message: 'Uang muka tidak boleh melebihi total',
      path: ['dp_value'],
    }
  )

export type UpdateSalesOrderFormData = z.infer<typeof UpdateSalesOrderSchema>
