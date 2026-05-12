import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { RolesContext } from '../components/company-roles-provider'
import {
  type BulkDeleteCompanyRoleSettingsFormData,
  type CreateCompanyRoleSettingsFormData,
  type UpdateCompanyRoleSettingsFormData,
} from '../types/company-roles.schema'

export function useCreateCompanyRoleMutation() {
  const rolesContext = React.useContext(RolesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateCompanyRoleSettingsFormData) => {
      const response = await apiClient.post(`roles`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'company-roles-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('company-roles-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.COMPANY_ROLES],
      })
      toast.success('Peran berhasil ditambahkan.')
      rolesContext?.setOpen(null)
    },
    onError: () => {
      toast.dismiss('company-roles-toast')
      toast.error('Peran gagal ditambahkan.')
    },
  })
}

export function useUpdateCompanyRoleMutation() {
  const rolesContext = React.useContext(RolesContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateCompanyRoleSettingsFormData) => {
      const { id, ...data } = payload
      const response = await apiClient.patch(`roles/${id}`, data)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'company-roles-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('company-roles-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.COMPANY_ROLES],
      })
      toast.success('Peran berhasil diubah.')
      rolesContext?.setOpen(null)
    },
    onError: () => {
      toast.dismiss('company-roles-toast')
      toast.error('Peran gagal diubah.')
    },
  })
}

export function useBulkDeleteCompanyRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteCompanyRoleSettingsFormData) => {
      const response = await apiClient.post('/roles/bulk-delete', credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data...', {
        id: 'bulk-delete-company-roles-toast',
      })
    },
    onSuccess: async (_) => {
      toast.dismiss('bulk-delete-company-roles-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.COMPANY_ROLES],
      })
      toast.success('Data peran berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('bulk-delete-company-roles-toast')
      toast.error('Gagal menghapus data peran.')
    },
  })
}
