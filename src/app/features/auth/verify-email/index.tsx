import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { VerifyEmailForm } from './components/verify-email-form'
import { useVerifyEmailForm } from './hooks/useVerifyEmailForm'

export function VerifyEmail() {
  const { form, isLoading, onSubmit, onResendOtp, isResending } =
    useVerifyEmailForm()

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Verifikasi Email
          </CardTitle>
          <CardDescription>
            Silakan masukkan kode verifikasi yang telah dikirim ke email Anda.
            <br /> Kode verifikasi berlaku selama 10 menit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Tidak menerima kode?{' '}
            <button
              type='button'
              onClick={onResendOtp}
              disabled={isResending}
              className='hover:text-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isResending ? 'Mengirim...' : 'Kirim ulang kode'}
            </button>
            .
          </p>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Sudah punya akun?{' '}
            <Link
              to='/login'
              className='hover:text-primary underline underline-offset-4'
            >
              Kembali ke Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
