import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg tracking-tight'>
              Lupa Kata Sandi
            </CardTitle>
            <Button variant='link' onClick={() => history.back()}>
              Kembali
            </Button>
          </div>
          <CardDescription>
            Masukkan email terdaftar Anda, kami akan mengirim otp untuk
            verifikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            Belum punya akun?{' '}
            <Link
              to='/register'
              className='hover:text-primary underline underline-offset-4'
            >
              Daftar
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
