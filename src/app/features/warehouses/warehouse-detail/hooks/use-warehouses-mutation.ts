import { QUERY_KEY } from "@/constants/query-key"
import apiClient from "@/lib/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// hooks/use-warehouse-detail.ts
export function useWarehouseMutation() {
  const queryClient = useQueryClient()

  // Mutasi Hapus Satuan
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/warehouses/${id}`)
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus gudang...', { id: 'warehouse-delete-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('warehouse-delete-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Gudang berhasil dihapus.')
    },
    onError: (error: any) => {
      toast.dismiss('warehouse-delete-toast')
      const message = error.response?.data?.message || 'Gagal menghapus gudang.'
      toast.error(message)
    },
  })

  // Mutasi Hapus Massal (Bulk Delete)
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await apiClient.post(`/warehouses/bulk-delete`, { ids })
      return response.data
    },
    onMutate: () => {
      toast.loading('Menghapus data gudang...', { id: 'warehouse-bulk-toast' })
    },
    onSuccess: async () => {
      toast.dismiss('warehouse-bulk-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.WAREHOUSE] })
      toast.success('Data gudang berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('warehouse-bulk-toast')
      toast.error('Gagal menghapus beberapa data gudang.')
    },
  })

  return {
    deleteMutation,
    bulkDeleteMutation,
  }
}