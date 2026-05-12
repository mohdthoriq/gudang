import { z } from 'zod'

export const companySettingsSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama perusahaan minimal 2 karakter' })
    .max(200, { message: 'Nama perusahaan maksimal 200 karakter' })
    .optional(),
  email: z
    .string()
    .email({ message: 'Email tidak valid' })
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z
    .string()
    .min(7, { message: 'Nomor telepon minimal 7 karakter' })
    .optional()
    .nullable()
    .or(z.literal('')),
  npwp: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (val === undefined || val === null) return true
        return val.length >= 15
      },
      { message: 'NPWP minimal 15 karakter' }
    )
    .refine(
      (val) => {
        if (val === undefined || val === null) return true
        return val.length <= 16
      },
      { message: 'NPWP maksimal 16 karakter' }
    ),
  address: z
    .string()
    .min(5, { message: 'Alamat minimal 5 karakter' })
    .max(500, { message: 'Alamat maksimal 500 karakter' })
    .optional()
    .nullable(),
  logo_url: z
    .union([
      z.url({ message: 'URL logo tidak valid' }),
      z.literal('pending-upload'),
      z.literal(''),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .nullable(),
})

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>
