import type { HTMLAttributes } from 'react'
import { AuthPurpose } from '@/types'
import { ArrowRight, Loader2 } from 'lucide-react'
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
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm'

export function ForgotPasswordForm({
  className,
  ...props
}: HTMLAttributes<HTMLFormElement>) {
  const { form, isLoading, onSubmit } = useForgotPasswordForm({
    redirectTo: '/verify-email',
    purpose: AuthPurpose.PasswordReset,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
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
        <Button className='mt-2' disabled={isLoading}>
          Lanjutkan
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  )
}
