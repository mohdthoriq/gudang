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
import { ResetPasswordForm } from './components/reset-password-form'

export function ResetPassword() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg tracking-tight'>
              Buat Kata Sandi Baru
            </CardTitle>
            <Button variant='link'>
              <Link to='/login'>Kembali</Link>
            </Button>
          </div>
          <CardDescription>
            Masukkan kata sandi baru untuk akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
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
