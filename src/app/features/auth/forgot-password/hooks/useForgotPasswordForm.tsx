import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AuthPurpose } from '@/types'
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../types/forgot-password.types'
import { useForgotPasswordMutation } from './useForgotPasswordMutation'

interface UseForgotPasswordFormProps {
  redirectTo?: string
  purpose?: AuthPurpose
}

export function useForgotPasswordForm({
  redirectTo,
  purpose,
}: UseForgotPasswordFormProps = {}) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const forgotPasswordMutation = useForgotPasswordMutation({ redirectTo, purpose })

  function onSubmit(data: ForgotPasswordFormData) {
    forgotPasswordMutation.mutate(data)
  }

  return {
    form,
    isLoading: forgotPasswordMutation.isPending,
    onSubmit,
  }
}
