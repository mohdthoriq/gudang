import { z } from 'zod'

export const createAccountCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori akun harus diisi'),
  description: z.string().min(1, 'Deskripsi kategori akun harus diisi'),
  account_type: z.string().optional(),
  normal_balance: z.string().optional(),
  report_group: z.string().optional(),
  code_prefix: z.string().optional(),
  allowed_transactions: z
    .array(
      z.object({ transaction_type_id: z.string().min(1, 'Pilih transaksi') })
    )
    .min(1, 'Minimal satu transaksi diizinkan'),
})

export type CreateAccountCategoryFormData = z.infer<
  typeof createAccountCategorySchema
>

export const updateAccountCategorySchema = createAccountCategorySchema.extend({
  id: z.uuid(),
})

export type UpdateAccountCategoryFormData = z.infer<
  typeof updateAccountCategorySchema
>

export const deleteAccountCategorySchema = z.object({
  id: z.uuid(),
})

export type DeleteAccountCategoryFormData = z.infer<
  typeof deleteAccountCategorySchema
>

export type CreateAccountCategoryRequest = Omit<
  CreateAccountCategoryFormData,
  'allowed_transactions'
> & {
  allowed_transactions: string[]
}

export type UpdateAccountCategoryRequest = Omit<
  UpdateAccountCategoryFormData,
  'allowed_transactions'
> & {
  allowed_transactions: string[]
}

export const bulkDeleteAccountCategorySchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteAccountCategoryFormData = z.infer<
  typeof bulkDeleteAccountCategorySchema
>
