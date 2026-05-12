import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Tax } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  createTaxesSchema,
  type CreateTaxesFormData,
  type UpdateTaxesFormData,
} from '../types/taxes.schema'
import {
  useCreateTaxMutation,
  useUpdateTaxMutation,
} from './use-taxes-mutation'
import type { AxiosError } from 'axios'

type useTaxesFormProps = {
  currentRow?: Tax
  onSuccess?: (data: Tax) => void
}

export function useTaxesForm({ currentRow, onSuccess }: useTaxesFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)

  const isEdit = !!currentRow
  const form = useForm<CreateTaxesFormData>({
    resolver: zodResolver(createTaxesSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name || '',
          rate: currentRow?.rate ?? 0,
          company_id: currentRow?.company?.id ?? company?.id ?? '',
          description: currentRow?.description || '',
          is_withholding: currentRow?.is_withholding ?? false,
          buy_account_id: currentRow?.buy_account?.id ?? '',
          sell_account_id: currentRow?.sell_account?.id ?? '',
          is_active: currentRow?.is_active ?? false,
        }
      : {
          company_id: company?.id ?? '',
          name: '',
          rate: 0,
          description: '',
          is_withholding: false,
          buy_account_id: '',
          sell_account_id: '',
          is_active: true,
        },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentRow is the primary trigger
  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name || '',
        rate: currentRow.rate ?? 0,
        company_id: currentRow.company?.id ?? company?.id ?? '',
        description: currentRow.description || '',
        is_withholding: currentRow.is_withholding ?? false,
        buy_account_id: currentRow.buy_account?.id ?? '',
        sell_account_id: currentRow.sell_account?.id ?? '',
        is_active: currentRow.is_active ?? false,
      })
    } else {
      form.reset({
        company_id: company?.id ?? '',
        name: '',
        rate: 0,
        description: '',
        is_withholding: false,
        buy_account_id: '',
        sell_account_id: '',
        is_active: true,
      })
    }
  }, [currentRow, company, form])

  const createMutation = useCreateTaxMutation(onSuccess)
  const updateMutation = useUpdateTaxMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateTaxesFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateTaxesFormData = {
        id: currentRow.id,
        name: data.name,
        rate: data.rate,
        description: data.description,
        is_withholding: data.is_withholding,
        buy_account_id: data.buy_account_id,
        sell_account_id: data.sell_account_id,
        is_active: data.is_active,
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
  }
}
