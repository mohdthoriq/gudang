import z from 'zod'

export const ForgotPasswordSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Silakan masukkan email Anda' : undefined,
  }),
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>
