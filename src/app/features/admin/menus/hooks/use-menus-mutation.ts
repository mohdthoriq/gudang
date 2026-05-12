import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'
import { useMenus } from '../components/menus-provider'
import {
  type CreateMenusFormData,
  type UpdateMenusFormData,
  type DeleteMenusFormData,
  type BulkDeleteMenusFormData,
} from '../types/menus.schema'

export function useCreateMenuMutation() {
  const { setOpen } = useMenus()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateMenusFormData) => {
      const response = await apiClient.post(`menus`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'menus-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('menus-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.MENUS],
      })
      toast.success('Menu berhasil ditambahkan.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('menus-toast')
      toast.error('Menu gagal ditambahkan.')
    },
  })
}

export function useUpdateMenuMutation() {
  const { setOpen } = useMenus()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateMenusFormData) => {
      const response = await apiClient.patch(
        `menus/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'menus-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('menus-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.MENUS],
      })
      toast.success('Menu berhasil diubah.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('menus-toast')
      toast.error('Menu gagal diubah.')
    },
  })
}

export function useDeleteMenuMutation() {
  const { setOpen } = useMenus()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteMenusFormData) => {
      const response = await apiClient.delete(`menus/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'menus-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('menus-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.MENUS],
      })
      toast.success('Menu berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('menus-toast')
      toast.error('Menu gagal dihapus.')
    },
  })
}

export function useBulkDeleteMenuMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteMenusFormData) => {
      const response = await apiClient.post(`/menus/bulk-delete`, credentials)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'menus-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('menus-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ADMIN.MENUS],
      })
      toast.success('Menu berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('menus-toast')
      toast.error('Menu gagal dihapus.')
    },
  })
}
