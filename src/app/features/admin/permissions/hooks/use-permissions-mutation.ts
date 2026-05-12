import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'
import { usePermissions } from '../components/permissions-provider'
import {
  type CreatePermissionFormData,
  type UpdatePermissionFormData,
  type DeletePermissionFormData,
  type BulkDeletePermissionFormData,
} from '../types/permissions.schema'

export function useCreatePermissionMutation() {
  const { setOpen } = usePermissions()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreatePermissionFormData) => {
      const response = await apiClient.post(`permissions`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'permissions-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('permissions-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS_TREE],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS],
      })
      toast.success('Permission berhasil ditambahkan.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('permissions-toast')
      toast.error('Permission gagal ditambahkan.')
    },
  })
}

export function useUpdatePermissionMutation() {
  const { setOpen } = usePermissions()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdatePermissionFormData) => {
      const response = await apiClient.patch(
        `permissions/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'permissions-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('permissions-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS_TREE],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS],
      })
      toast.success('Permission berhasil diubah.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('permissions-toast')
      toast.error('Permission gagal diubah.')
    },
  })
}

export function useDeletePermissionMutation() {
  const { setOpen } = usePermissions()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeletePermissionFormData) => {
      const response = await apiClient.delete(`permissions/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'permissions-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('permissions-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS_TREE],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS],
      })
      toast.success('Permission berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('permissions-toast')
      toast.error('Permission gagal dihapus.')
    },
  })
}

export function useBulkDeletePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeletePermissionFormData) => {
      const response = await apiClient.post(
        `/permissions/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'permissions-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('permissions-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PERMISSIONS_TREE],
      })
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.PLAN_PERMISSIONS],
      })
      toast.success('Permission berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('permissions-toast')
      toast.error('Permission gagal dihapus.')
    },
  })
}
