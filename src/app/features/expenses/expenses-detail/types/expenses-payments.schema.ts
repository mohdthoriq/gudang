import { z } from 'zod'

export const expensesPaymentsSchema = z.object({
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  note: z.string().optional(),
  tags: z.array(z.uuid()).nullable(),
  expense_id: z.uuid(),
})

export type ExpensesPaymentsFormData = z.infer<typeof expensesPaymentsSchema>

export const deleteExpensesSchema = z.object({
  ids: z
    .array(z.string())
    .min(1, 'Pilih setidaknya satu invoice untuk dihapus'),
})

export type DeleteExpensesFormData = z.infer<typeof deleteExpensesSchema>

export const expensesPaymentsUpdateSchema = z.object({
  id: z.uuid(),
  payment_date: z.date(),
  amount: z.number().min(1, 'Jumlah harus lebih dari 0'),
  account_id: z.uuid('Akun harus dipilih'),
  note: z.string().optional(),
  tags: z.array(z.uuid()).nullable(),
  expense_id: z.uuid(),
})

export type ExpensesPaymentsUpdateFormData = z.infer<
  typeof expensesPaymentsUpdateSchema
>
