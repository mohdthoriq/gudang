import { z } from 'zod'
import { updateDeductions } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'

export const expenseItemSchema = z.object({
  id: z.uuid().optional().nullable(),
  account_id: z.string().min(1, 'Akun tidak boleh kosong'),
  description: z.string().optional(),
  tax_id: z.string().optional(),
  amount: z.number().min(0, 'Total tidak boleh negatif'),
  tax_amount: z.number().optional(),
})

export type ExpenseItemFormData = z.infer<typeof expenseItemSchema>

// Define the base object schema separately so it can be extended before refinement
const baseExpenseSchema = z.object({
  id: z.string().optional(),
  contact_id: z.string().min(1, 'Penerima tidak boleh kosong'),
  account_id: z.uuid('ID akun tidak boleh kosong').optional().nullable(),
  payment_term_id: z.string().optional(),
  expense_number: z.string().min(1, 'Nomor expense tidak boleh kosong'),
  note: z.string().optional(),

  date: z.date(),
  due_date: z.date(),

  currency: z.string().optional(),
  subtotal: z.number().nonnegative(),
  tax_total: z.number(),
  total: z.number().nonnegative(),

  is_paylater: z.boolean(),
  include_tax: z.boolean(),

  expense_items: z
    .array(expenseItemSchema)
    .min(1, 'Expense harus memiliki minimal 1 item'),
  deductions: z.array(updateDeductions).optional(),
  tags: z.array(z.uuid()).nullable(),
  images: z.any().array().optional(),
})

export const CreateExpenseSchema = baseExpenseSchema.refine(
  (data) => data.date <= data.due_date,
  {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal expense',
    path: ['due_date'],
  }
)

export type CreateExpenseFormData = z.infer<typeof CreateExpenseSchema>

export const UpdateExpenseSchema = baseExpenseSchema
  .extend({
    id: z.uuid().min(1, 'ID expense tidak boleh kosong'),
  })
  .refine((data) => data.date <= data.due_date, {
    message: 'Tanggal jatuh tempo harus lebih dari tanggal expense',
    path: ['due_date'],
  })

export type UpdateExpenseFormData = z.infer<typeof UpdateExpenseSchema>

// Use this for the form generic to avoid union type issues
export type ExpenseFormData = Omit<UpdateExpenseFormData, 'id'> & {
  id?: string
}
