import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthFlowStore } from '@/stores/auth-flow-store'
import apiClient from '@/lib/api-client'
import type { ResetPasswordPayload } from '../types/reset-password.types'

interface UseResetPasswordMutationProps {
  redirectTo?: string
}

export function useResetPasswordMutation({
  redirectTo = '/login',
}: UseResetPasswordMutationProps = {}) {
  const navigate = useNavigate()
  const clearAuthFlow = useAuthFlowStore((state) => state.clearAuthFlow)

  return useMutation({
    mutationFn: async (data: ResetPasswordPayload) => {
      const response = await apiClient.post('/auth/reset-password', data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'reset-password-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('reset-password-toast')
      toast.success(`Berhasil melakukan reset password`)

      clearAuthFlow()

      try {
        await navigate({
          to: redirectTo,
          replace: true,
        })
      } catch {
        // Navigation error, but request was successful - silently ignore
      }
    },
    onError: (error) => {
      toast.dismiss('reset-password-toast')
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Gagal melakukan reset password. Silakan coba lagi.')
      }
    },
  })
}
