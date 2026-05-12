import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthFlowStore } from '@/stores/auth-flow-store'
import apiClient from '@/lib/api-client'
import { type VerifyEmailFormData } from '../types/verify-email.types'
import { AxiosError } from 'axios'

export function useVerifyEmailMutation() {
  const navigate = useNavigate()
  const clearAuthFlow = useAuthFlowStore((state) => state.clearAuthFlow)

  return useMutation({
    mutationFn: async (credentials: VerifyEmailFormData) => {
      const response = await apiClient.post('/auth/otp/verify', credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'VerifyEmail-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('VerifyEmail-toast')

      toast.success('Email berhasil di verifikasi! Silakan Login.')

      clearAuthFlow()

      try {
        await navigate({ to: '/login', replace: true })
      } catch {
        // Continue without navigation - user can manually navigate
      }
    },
    onError: (error) => {
      toast.dismiss('VerifyEmail-toast')
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Pendaftaran gagal. Silakan lakukan ulang pendaftaran.')
      }
    },
  })
}
