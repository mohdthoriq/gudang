import z from 'zod'
import { AuthPurpose } from '@/types'

export const VerifyEmailSchema = z.object({
  otp_code: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
  email: z.string().email('Please enter a valid email address.'),
  purpose: z.nativeEnum(AuthPurpose),
})

export type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>
