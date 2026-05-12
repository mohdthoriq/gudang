import { z } from 'zod'

export const userSettingsSchema = z
  .object({
    full_name: z
      .string()
      .min(2, { message: 'Nama lengkap tidak valid' })
      .max(100, { message: 'Nama lengkap maksimal 100 karakter' }),
    email: z
      .email({ message: 'Email tidak valid' })
      .min(1, { message: 'Email wajib diisi' }),
    phone: z
      .string()
      .min(1, { message: 'Nomor telepon wajib diisi' })
      .min(7, { message: 'Nomor telepon tidak valid' }),
    old_password: z.string().optional(),
    new_password: z
      .string()
      .min(8, { message: 'Password minimal 8 karakter' })
      .optional()
      .or(z.literal('')),
    confirm_password: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      // Only validate password confirmation if both new_password and confirm_password are provided
      if (
        data.new_password &&
        data.new_password.length > 0 &&
        data.confirm_password &&
        data.confirm_password.length > 0
      ) {
        return data.new_password === data.confirm_password
      }
      return true
    },
    {
      message: 'Konfirmasi password tidak cocok',
      path: ['confirm_password'],
    }
  )

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>
