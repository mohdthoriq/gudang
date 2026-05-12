import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProductCategory } from '@/types'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  ProductCategoryContext,
  useProductCategories,
} from '../components/product-category-provider'
import type {
  CreateProductCategoryFormData,
  DeleteProductCategoryFormData,
  UpdateProductCategoryFormData,
  BulkDeleteProductCategoryFormData,
} from '../types/product-category.schema'

export function useCreateProductCategoryMutation(
  onSuccess?: (data: ProductCategory) => void
) {
  const context = useContext(ProductCategoryContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: CreateProductCategoryFormData) => {
      const response = await apiClient.post(`product-categories`, credentials)
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'product-categories-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('product-categories-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_CATEGORIES],
      })
      toast.success('Kategori produk berhasil ditambahkan.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('product-categories-toast')
      toast.error('Kategori produk gagal ditambahkan.')
    },
  })
}

export function useUpdateProductCategoryMutation(
  onSuccess?: (data: ProductCategory) => void
) {
  const context = useContext(ProductCategoryContext)

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: UpdateProductCategoryFormData) => {
      const response = await apiClient.patch(
        `product-categories/${credentials.id}`,
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'product-categories-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('product-categories-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_CATEGORIES],
      })
      toast.success('Kategori produk berhasil diubah.')
      context?.setOpen(null)
      onSuccess?.(data)
    },
    onError: () => {
      toast.dismiss('product-categories-toast')
      toast.error('Kategori produk gagal diubah.')
    },
  })
}

export function useDeleteProductCategoryMutation() {
  const { setOpen } = useProductCategories()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: DeleteProductCategoryFormData) => {
      const response = await apiClient.delete(
        `product-categories/${credentials.id}`
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'product-categories-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('product-categories-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_CATEGORIES],
      })
      toast.success('Kategori produk berhasil dihapus.')
      setOpen(null)
    },
    onError: () => {
      toast.dismiss('product-categories-toast')
      toast.error('Kategori produk gagal dihapus.')
    },
  })
}

export function useBulkDeleteProductCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: BulkDeleteProductCategoryFormData) => {
      const response = await apiClient.post(
        `/product-categories/bulk-delete`,
        credentials
      )

      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'product-categories-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('product-categories-toast')
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_CATEGORIES],
      })
      toast.success('Kategori produk berhasil dihapus.')
    },
    onError: () => {
      toast.dismiss('product-categories-toast')
      toast.error('Kategori produk gagal dihapus.')
    },
  })
}
