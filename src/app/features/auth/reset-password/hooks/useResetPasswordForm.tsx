import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthFlowStore } from '@/stores/auth-flow-store'
import {
  ResetPasswordSchema,
  type ResetPasswordFormData,
} from '../types/reset-password.types'
import { useResetPasswordMutation } from './useResetPasswordMutation'

interface UseResetPasswordFormProps {
  redirectTo?: string
}

export function useResetPasswordForm({
  redirectTo,
}: UseResetPasswordFormProps = {}) {
  const { email, otp_code } = useAuthFlowStore()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || '',
      otp_code: otp_code || '',
      password: '',
      confirmPassword: '',
    },
  })

  const resetPasswordMutation = useResetPasswordMutation({ redirectTo })

  function onSubmit(data: ResetPasswordFormData) {
    const payload = {
      email: data.email,
      otp_code: data.otp_code,
      password: data.password,
    }
    resetPasswordMutation.mutate(payload)
  }

  return {
    form,
    isLoading: resetPasswordMutation.isPending,
    onSubmit,
  }
}
