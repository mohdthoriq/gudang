import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AuthPurpose } from '@/types'
import { VerifyEmail } from '@/features/auth/verify-email'

const verifyEmailSearchSchema = z.object({
  email: z.string().optional(),
  purpose: z.nativeEnum(AuthPurpose).optional(),
})

export const Route = createFileRoute('/(auth)/verify-email')({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search),
  component: VerifyEmail,
})