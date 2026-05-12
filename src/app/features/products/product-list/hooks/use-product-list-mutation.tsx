import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import { useProducts } from '../components/products-provider'
import type {
  BulkDeleteProductFormData,
  DeleteProductFormData,
} from '../types/products-list.schema'

export function useDeleteProductMutation() {
  const { setOpen } = useProducts()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteProductFormData) => {
      const response = await apiClient.delete(`/products/${credentials.id}`)

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'products-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('products-toast')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] })
      toast.success('Produk berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('products-toast')
      toast.error('Produk gagal dihapus.')
    },
  })
}

export function useBulkDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteProductFormData) => {
      const response = await apiClient.post(
        `/products/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'products-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('products-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCTS],
      })
      toast.success('Produk berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('products-toast')
      toast.error('Produk gagal dihapus.')
    },
  })
}
