import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.email('Email tidak valid').min(1, 'Email harus diisi'),
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  role_id: z.string().min(1, 'Role harus diisi'),
  company_id: z.string().min(1, 'Perusahaan harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  email: z.string().email('Email tidak valid').min(1, 'Email harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  role_id: z.string().min(1, 'Role harus diisi'),
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

export const deleteUserSchema = z.object({
  id: z.uuid(),
})

export type DeleteUserFormData = z.infer<typeof deleteUserSchema>

export const updateUserStatusSchema = z.object({
  id: z.uuid(),
  is_active: z.boolean(),
})

export type UpdateUserStatusFormData = z.infer<typeof updateUserStatusSchema>
export const bulkDeleteUserSchema = z.object({
  ids: z.array(z.string().uuid()),
})

export type BulkDeleteUserFormData = z.infer<typeof bulkDeleteUserSchema>
