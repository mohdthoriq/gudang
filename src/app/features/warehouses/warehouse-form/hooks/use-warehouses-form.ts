import { useEffect, useMemo } from 'react'
import type { AxiosError } from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Warehouse } from '@/types'
import {
  type CreateWarehouseFormData,
  type UpdateWarehouseFormData,
  createWarehouseSchema,
} from '../types/warehouses.schema'
import {
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
} from './use-warehouses-mutation'

type useWarehousesFormProps = {
  currentRow?: Warehouse
  onSuccess?: (data: unknown) => void
}

export function useWarehousesForm({
  currentRow,
  onSuccess,
}: useWarehousesFormProps) {
  const isEdit = !!currentRow

  const defaultValues = useMemo(
    () =>
      isEdit
        ? {
            name: currentRow?.name ?? '',
            code: currentRow?.code ?? '',
            description: currentRow?.description ?? undefined, 
          }
        : {
            name: '',
            code: '',
            description: '', 
          },
    [currentRow, isEdit]
  )

  const form = useForm<CreateWarehouseFormData>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (currentRow) {
      form.reset(defaultValues)
    }
  }, [currentRow, form, defaultValues])

  const createMutation = useCreateWarehouseMutation(onSuccess)
  const updateMutation = useUpdateWarehouseMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit: SubmitHandler<CreateWarehouseFormData> = async (data) => {
   

    if (isEdit && currentRow) {
      const updateData: UpdateWarehouseFormData = {
        id: currentRow.id,
        ...data,
      }
      await updateMutation.mutateAsync(updateData)
      form.reset()
    } else {
      await createMutation.mutateAsync(data)
      form.reset()
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    errorMessage,
    isEdit,
  }
}