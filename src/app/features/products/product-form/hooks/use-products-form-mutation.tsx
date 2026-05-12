import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import apiClientFormData from '@/lib/api-client-form-data'
import { type ApiResponse } from '@/types'
import type { CreateProductFormData } from '../types/product-form.schema'

export function useUploadImageProduct() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClientFormData.post(`products/images`, formData)
      return response.data
    },
    onError: () => {
      toast.error('Gambar produk gagal ditambahkan.')
    },
  })
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateProductFormData) => {
      const response = await apiClient.post(`products`, data)
      if (response.data.data && response.data.data.available === false) {
        throw response.data
      }
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'products-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('products-toast')
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produk berhasil ditambahkan.')
    },
    onError: (error: unknown) => {
      toast.dismiss('products-toast')
      const apiError = error as ApiResponse<{ available?: boolean; message?: string }>
      if (apiError?.data?.available === false) {
        toast.error(apiError.data.message || 'Nomor SKU sudah digunakan.')
      } else {
        toast.error('Produk gagal ditambahkan.')
      }
    },
  })
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: CreateProductFormData
    }) => {
      const response = await apiClient.patch(`products/${id}/`, data)
      if (response.data.data && response.data.data.available === false) {
        throw response.data
      }
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'products-toast' })
    },
    onSuccess: async (_) => {
      toast.dismiss('products-toast')
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produk berhasil diperbarui.')
    },
    onError: (error: unknown) => {
      toast.dismiss('products-toast')
      const apiError = error as ApiResponse<{ available?: boolean; message?: string }>
      if (apiError?.data?.available === false) {
        toast.error(apiError.data.message || 'Nomor SKU sudah digunakan.')
      } else {
        toast.error('Produk gagal diperbarui.')
      }
    },
  })
}
