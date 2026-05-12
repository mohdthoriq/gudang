import { useMutation } from '@tanstack/react-query'
import type { ApiResponse, AuthMe } from '@/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import apiClient from '@/lib/api-client'
import { type UserSettingsFormData } from '../types/user-settings.schema'

export function useUserSettingsMutation(userId: string) {
  const { auth } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: UserSettingsFormData) => {
      const response = await apiClient.patch(`users/${userId}`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'user-settings-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('user-settings-toast')

      try {
        const response = await apiClient.get<ApiResponse<AuthMe>>(`auth/me`)
        auth.updateUser(response.data?.data)
        toast.success('Pengaturan berhasil diubah.')
      } catch (err) {
        toast.error('Gagal mengambil data profile.' + err)
      }
    },
    onError: () => {
      toast.dismiss('user-settings-toast')
      toast.error('Pengaturan gagal diubah.')
    },
  })
}
