import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthPurpose } from '@/types'
import { useAuthFlowStore } from '@/stores/auth-flow-store'
import { LoginSchema, type LoginFormData } from '../types/login.types'
import { useLoginMutation } from './useLoginMutation'
import { useResendOtpMutation } from './useResendOtpMutation'
import { useUnverifiedEmailDialog } from './useUnverifiedEmailDialog'

export function useLoginForm() {
  const unverifiedEmailDialog = useUnverifiedEmailDialog()
  const resendOtpMutation = useResendOtpMutation()
  const setAuthFlow = useAuthFlowStore((state) => state.setAuthFlow)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useLoginMutation({
    onUnverifiedEmail: (email) => {
      unverifiedEmailDialog.openDialog(email)
    },
  })

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data)
  }

  function handleResendOtp() {
    if (unverifiedEmailDialog.email) {
      setAuthFlow({
        email: unverifiedEmailDialog.email,
        purpose: AuthPurpose.Registration,
      })

      resendOtpMutation.mutate({
        email: unverifiedEmailDialog.email,
        purpose: AuthPurpose.Registration,
        redirectTo: '/verify-email',
        searchParams: {
          email: unverifiedEmailDialog.email,
          purpose: AuthPurpose.Registration,
        },
      })
    }
  }

  function handleGoToVerify() {
    if (unverifiedEmailDialog.email) {
      setAuthFlow({
        email: unverifiedEmailDialog.email,
        purpose: AuthPurpose.Registration,
      })
    }
  }

  return {
    form,
    isLoading: loginMutation.isPending,
    onSubmit,
    unverifiedEmailDialog: {
      ...unverifiedEmailDialog,
      onResendOtp: handleResendOtp,
      onGoToVerify: handleGoToVerify,
    },
  }
}
