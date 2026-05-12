import { useMutation } from '@tanstack/react-query'
import apiClientFormData from '@/lib/api-client-form-data'
import type { ApiResponse } from '@/types'

type UploadAttachmentsParams = {
  feature: 'sales-invoices' | 'purchase-invoices' | 'expenses'
  images: File[]
}

export function useUploadAttachmentsMutation() {
  return useMutation({
    mutationFn: async ({ feature, images }: UploadAttachmentsParams) => {
      const formData = new FormData()
      images.forEach((file) => {
        formData.append('images', file)
      })

      const response = await apiClientFormData.post<
        ApiResponse<{ urls: string[] }>
      >(`${feature}/attachments`, formData)
      return response.data
    },
  })
}
