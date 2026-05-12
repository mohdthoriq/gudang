import z from 'zod'

export const LoginSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Silakan masukkan email Anda' : undefined,
  }),
  password: z
    .string()
    .min(1, 'Silakan masukkan kata sandi Anda')
    .min(8, 'Kata sandi harus minimal 8 karakter'),
})

export type LoginFormData = z.infer<typeof LoginSchema>
