import z from 'zod'

export const ResetPasswordSchema = z
  .object({
    email: z.email(),
    otp_code: z.string().min(1, 'Token tidak boleh kosong'),
    password: z
      .string()
      .min(1, 'Tolong masukkan kata sandi Anda')
      .min(7, 'Kata sandi harus minimal 7 karakter')
      .regex(/[A-Z]/, 'Kata sandi harus mengandung minimal satu huruf kapital')
      .regex(/[0-9]/, 'Kata sandi harus mengandung minimal satu angka')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Kata sandi harus mengandung minimal satu simbol'
      ),
    confirmPassword: z.string().min(1, 'Tolong konfirmasi kata sandi Anda'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok.',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>

export type ResetPasswordPayload = Omit<
  ResetPasswordFormData,
  'confirmPassword'
>
