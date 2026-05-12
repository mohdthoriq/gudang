import { useEffect, useMemo, useRef, useState } from 'react'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ApiResponse,
  FinanceNumberType,
  type FinanceNumber,
  type Product,
} from '@/types'
import { toast } from 'sonner'
import { useGenerateNextNumber } from '@/hooks/use-auto-numbering'
import {
  type CreateProductFormData,
  createProductSchema,
} from '../types/product-form.schema'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImageProduct,
} from './use-products-form-mutation'

type useProductsFormProps = {
  currentRow?: Product | null
  autoNumbering?: FinanceNumber | null
  onSuccess?: (data: Product) => void
}

export function useProductsForm({
  currentRow,
  autoNumbering,
  onSuccess,
}: useProductsFormProps = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!currentRow
  const defaultValues = useMemo(
    () =>
      isEdit
        ? {
            sku: currentRow?.sku ?? '',
            name: currentRow?.name ?? '',
            description: currentRow?.description ?? '',
            purchase_price: Number(currentRow?.purchase_price ?? 0),
            sale_price: Number(currentRow?.sale_price ?? 0),
            taxable: currentRow?.taxable ?? false,
            unit_id: currentRow?.unit?.id ?? '',
            product_category_id: currentRow?.product_category?.id ?? '',
            images: [],
          }
        : {
            sku: autoNumbering?.format ?? '',
            name: '',
            description: '',
            taxable: false, // Provide default boolean
            unit_id: '',
            product_category_id: '',
            images: [],
            purchase_price: 0,
            sale_price: 0,
          },
    [currentRow, isEdit, autoNumbering]
  )

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultValues,
  })

  // Update form values when currentRow changes (e.g. after fetch)
  useEffect(() => {
    const updateForm = () => {
      if (currentRow) {
        form.reset(defaultValues)
        const imgs = Array.isArray(currentRow.images)
          ? currentRow.images.filter((img) => typeof img === 'string')
          : []
        setExistingImages(imgs)
        form.setValue('images', [])
      }
      if (!isEdit && autoNumbering) {
        form.setValue('sku', autoNumbering.format ?? '')
      }
    }
    updateForm()
  }, [currentRow, form, defaultValues, autoNumbering, isEdit])

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...newFiles])

    const base64Files = await Promise.all(
      newFiles.map((file) => convertToBase64(file))
    )

    // Append new base64 strings to existing form value
    const currentImages = form.getValues('images') || []
    form.setValue('images', [...currentImages, ...base64Files])
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const removeFile = (indexToRemove: number, source: 'new' | 'existing') => {
    if (source === 'new') {
      setUploadedFiles((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      )
      const currentImages = (form.getValues('images') as string[]) || []
      form.setValue(
        'images',
        currentImages.filter((_, index) => index !== indexToRemove)
      )
    } else {
      setExistingImages((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      )
    }
  }

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const uploadImageMutation = useUploadImageProduct()
  const generateNextNumber = useGenerateNextNumber()

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = (createMutation.error ||
    updateMutation.error) as ApiResponse<{
    available?: boolean
    message?: string
  }> | null
  const errorMessage =
    (mutationError
      ? mutationError.data?.message ||
        (mutationError as unknown as AxiosError<ApiResponse>).response?.data
          ?.message ||
        mutationError.message
      : undefined) ||
    (firstError && 'message' in firstError
      ? (firstError.message as string)
      : undefined)

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      let newImageUrls: string[] = []

      if (uploadedFiles.length > 10) {
        toast.error('Maksimal 10 gambar')
        return
      }

      // 1. Upload images if there are any new files
      if (uploadedFiles.length > 0) {
        const formData = new FormData()
        uploadedFiles.forEach((file) => {
          formData.append('images', file)
        })

        const uploadResponse = await uploadImageMutation.mutateAsync(formData)

        if (
          uploadResponse?.status === 'success' &&
          Array.isArray(uploadResponse.data?.urls)
        ) {
          newImageUrls = uploadResponse.data.urls
        }
      }

      // 2. Combine existing images and new URLs
      const finalImages = [...existingImages, ...newImageUrls]

      // 3. Prepare payload
      const payload: CreateProductFormData = {
        ...data,
        images: finalImages,
      }

      // 4. Create or Update Product
      if (isEdit && currentRow) {
        const response = await updateMutation.mutateAsync({
          id: currentRow.id,
          data: payload,
        })
        form.reset()
        if (onSuccess) {
          onSuccess(response)
        } else {
          history.back()
        }
      } else {
        const response = await createMutation.mutateAsync(payload)
        form.reset()
        await generateNextNumber.mutateAsync(FinanceNumberType.product_sku)
        if (onSuccess) {
          onSuccess(response)
        } else {
          history.back()
        }
      }
    } catch (error: unknown) {
      const apiError = error as ApiResponse<{
        available?: boolean
        message?: string
        type?: string
      }>
      if (
        apiError?.data?.type === 'product_sku' &&
        apiError?.data?.available === false
      ) {
        form.setError('sku', {
          type: 'manual',
          message: apiError.data.message || 'Nomor SKU sudah digunakan.',
        })
      }
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      uploadImageMutation.isPending,
    removeFile,
    uploadedFiles,
    existingImages,
    handleBoxClick,
    handleDragOver,
    handleDrop,
    fileInputRef,
    handleFileSelect,
    errorMessage,
  }
}
