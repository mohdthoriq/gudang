import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
// Pastikan kamu menyesuaikan path import di bawah ini dengan struktur foldermu
import { useWarehouses } from '../components/warehouses-provider'
import type {
  BulkDeleteWarehouseFormData,
  DeleteWarehouseFormData,
} from '../types/warehouses-list-schema'

export function useDeleteWarehouseMutation() {
  const { setOpen } = useWarehouses()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteWarehouseFormData) => {
      const response = await apiClient.delete(`/warehouses/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal dihapus.')
    },
  })
}

export function useBulkDeleteWarehouseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteWarehouseFormData) => {
      const response = await apiClient.post(
        `/warehouses/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'warehouses-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('warehouses-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('warehouses-toast')
      toast.error('Gudang gagal dihapus.')
    },
  })
}
