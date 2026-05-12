import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AuthPurpose } from '@/types'
import { toast } from 'sonner'
import { useAuthFlowStore } from '@/stores/auth-flow-store'
import { useResendOtpMutation } from '../../login/hooks/useResendOtpMutation'
import {
  type VerifyEmailFormData,
  VerifyEmailSchema,
} from '../types/verify-email.types'
import { useVerifyEmailMutation } from './useVerifyEmailMutation'

export function useVerifyEmailForm() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/verify-email' })

  const email = useAuthFlowStore((state) => state.email) || search.email
  const purpose = useAuthFlowStore((state) => state.purpose) || search.purpose
  const setAuthFlow = useAuthFlowStore((state) => state.setAuthFlow)
  const resendOtpMutation = useResendOtpMutation()

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      otp_code: '',
      email: email || '',
      purpose: purpose || AuthPurpose.Registration,
    },
  })

  // Sync form with store values if they arrive late (hydration)
  useEffect(() => {
    if (email) {
      form.setValue('email', email)
    }
  }, [email, form])

  useEffect(() => {
    if (purpose) {
      form.setValue('purpose', purpose)
    }
  }, [purpose, form])

  const verifyEmailMutation = useVerifyEmailMutation()

  function onSubmit(data: VerifyEmailFormData) {
    if (data.purpose === AuthPurpose.Registration) {
      verifyEmailMutation.mutate(data)
    } else {
      setAuthFlow({ otp_code: data.otp_code })

      navigate({
        to: '/reset-password',
        replace: true,
      })
    }
  }

  function handleResendOtp() {
    // Access store state directly to ensure we have the most up-to-date value
    const currentStore = useAuthFlowStore.getState()
    const formEmail = form.getValues('email')

    // Fallback order: Form value -> Hook state -> Store direct state
    const emailValue = formEmail || email || currentStore.email

    if (emailValue) {
      resendOtpMutation.mutate({
        email: emailValue,
        purpose: currentStore.purpose || purpose || AuthPurpose.Registration,
        redirectTo: '/verify-email',
      })
    } else {
      toast.error(
        'Gagal mengirim ulang kode: Email tidak ditemukan. Silakan masuk kembali.'
      )
    }
  }

  return {
    form,
    isLoading: verifyEmailMutation.isPending,
    isResending: resendOtpMutation.isPending,
    onSubmit,
    onResendOtp: handleResendOtp,
  }
}
