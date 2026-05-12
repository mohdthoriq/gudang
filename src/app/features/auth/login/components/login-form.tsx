import { Link } from '@tanstack/react-router'
import { AuthPurpose } from '@/types'
import { Loader2, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/forms/password-input'
import { useLoginForm } from '../hooks/useLoginForm'
import { UnverifiedEmailDialog } from './unverified-email-dialog'

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { form, isLoading, onSubmit, unverifiedEmailDialog } = useLoginForm()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='nama@contoh.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Kata Sandi</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-4' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Masuk
        </Button>
        <p className='text-muted-foreground text-center text-sm'>
          <Link
            to='/forgot-password'
            className='hover:text-primary underline underline-offset-4'
          >
            Lupa Password?
          </Link>
        </p>
        <p className='text-muted-foreground text-center text-sm'>
          Belum punya akun?{' '}
          <Link
            to='/register'
            className='hover:text-primary underline underline-offset-4'
          >
            Daftar
          </Link>
        </p>
      </form>
      <UnverifiedEmailDialog
        open={unverifiedEmailDialog.isOpen}
        onOpenChange={unverifiedEmailDialog.setOpen}
        email={unverifiedEmailDialog.email}
        onResendOtp={unverifiedEmailDialog.onResendOtp}
        onGoToVerify={unverifiedEmailDialog.onGoToVerify}
        purpose={AuthPurpose.Registration}
      />
    </Form>
  )
}
