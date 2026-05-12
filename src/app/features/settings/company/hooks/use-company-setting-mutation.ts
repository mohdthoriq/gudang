import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiResponse, AuthMe } from '@/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import apiClient from '@/lib/api-client'
import apiClientFormData from '@/lib/api-client-form-data'
import { QUERY_KEY } from '@/constants/query-key'
import { type CompanySettingsFormData } from '../types/company-settings.schema'

export function useCompanySettingsMutation(companyId: string) {
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  return useMutation({
    mutationFn: async (credentials: CompanySettingsFormData) => {
      const response = await apiClient.patch(
        `companies/${companyId}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'company-settings-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('company-settings-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.COMPANY, companyId],
      })

      try {
        const response = await apiClient.get<ApiResponse<AuthMe>>(`auth/me`)
        auth.updateUser(response.data?.data)
        toast.success('Pengaturan perusahaan berhasil diubah.')
      } catch (err) {
        toast.error('Gagal menyinkronkan data perusahaan.' + err)
      }
    },
    onError: () => {
      toast.dismiss('company-settings-toast')
      toast.error('Pengaturan perusahaan gagal diubah.')
    },
  })
}

export function useUploadCompanyLogo() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClientFormData.post('companies/logo', formData)
      return response.data
    },
    onError: () => {
      toast.error('Gagal mengunggah logo.')
    },
  })
}
