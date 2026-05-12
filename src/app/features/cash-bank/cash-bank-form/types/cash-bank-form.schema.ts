import { z } from 'zod'

export const cashBankFormItemSchema = z.object({
  account_id: z.uuid('Akun harus dipilih'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  description: z.string().optional(),
  tax_id: z.uuid().optional().nullable(),
})

export type CashBankFormItemFormData = z.infer<typeof cashBankFormItemSchema>

export const cashBankWithholdingSchema = z.object({
  account_id: z.uuid('Akun pemotongan harus dipilih'),
  name: z.string().min(1, 'Nama pemotongan harus diisi'),
  type: z.enum(['percent', 'fixed']),
  value: z.number().nonnegative(),
  amount: z.number().nonnegative(),
})

export type CashBankWithholdingFormData = z.infer<
  typeof cashBankWithholdingSchema
>

export const cashBankFormSchema = z.object({
  bank_account_id: z.uuid(),
  transaction_number: z.string().min(1, 'Nomor Transaksi harus diisi'),
  date: z.date(),
  description: z.string().optional(),
  contact_id: z.uuid('Kontak harus dipilih').optional().nullable(),
  note: z.string().optional(),
  tags: z.array(z.string()).nullable(),
  include_tax: z.boolean(),
  tax_total: z.number().nonnegative(),
  items: z.array(cashBankFormItemSchema).min(1, 'Minimal harus ada 1 item'),
  withholdings: z.array(cashBankWithholdingSchema),
})

export type CashBankFormFormData = z.infer<typeof cashBankFormSchema>

export const cashBankFormEditSchema = z.object({
  id: z.uuid(),
  bank_account_id: z.uuid(),
  transaction_number: z.string().min(1, 'Nomor Transaksi harus diisi'),
  date: z.date(),
  description: z.string().optional(),
  contact_id: z.uuid('Kontak harus dipilih').optional().nullable(),
  note: z.string().optional(),
  tags: z.array(z.string()).nullable(),
  include_tax: z.boolean(),
  tax_total: z.number().nonnegative(),
  items: z.array(cashBankFormItemSchema).min(1, 'Minimal harus ada 1 item'),
  withholdings: z.array(cashBankWithholdingSchema),
})

export type CashBankFormEditData = z.infer<typeof cashBankFormEditSchema>
