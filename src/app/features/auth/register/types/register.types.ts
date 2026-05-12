import z from 'zod'

export interface RegisterResponse {
  email: string
  message: string
}

export const RegisterSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Tolong masukkan email Anda' : undefined,
    }),
    full_name: z.string().min(1, 'Tolong masukkan nama lengkap Anda'),
    phone: z.string().min(1, 'Tolong masukkan nomor telepon Anda'),
    company_name: z.string().min(1, 'Tolong masukkan nama perusahaan Anda'),
    address: z.string().min(1, 'Tolong masukkan alamat perusahaan Anda'),
    password: z
      .string()
      .min(1, 'Tolong masukkan kata sandi Anda')
      .min(8, 'Kata sandi harus minimal 8 karakter')
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

export type RegisterFormData = z.infer<typeof RegisterSchema>
