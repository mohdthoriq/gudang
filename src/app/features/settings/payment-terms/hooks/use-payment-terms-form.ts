import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, PaymentTerm } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  createPaymentTermsSchema,
  type CreatePaymentTermsFormData,
  type UpdatePaymentTermsFormData,
} from '../types/payment-terms.schema'
import {
  useCreatePaymentTermMutation,
  useUpdatePaymentTermMutation,
} from './use-payment-terms-mutation'
import type { AxiosError } from 'axios'

type usePaymentTermsFormProps = {
  currentRow?: PaymentTerm
  onSuccess?: (data: PaymentTerm) => void
}

export function usePaymentTermsForm({ currentRow, onSuccess }: usePaymentTermsFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)

  const isEdit = !!currentRow
  const form = useForm<CreatePaymentTermsFormData>({
    resolver: zodResolver(createPaymentTermsSchema),
    defaultValues: isEdit
      ? {
          company_id: currentRow?.company?.id ?? company?.id ?? '',
          name: currentRow?.name || '',
          days: currentRow?.days || 0,
        }
      : {
          company_id: company?.id ?? '',
          name: '',
        },
  })

  const createMutation = useCreatePaymentTermMutation(onSuccess)
  const updateMutation = useUpdatePaymentTermMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreatePaymentTermsFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdatePaymentTermsFormData = {
        id: currentRow.id,
        name: data.name,
        days: data.days,
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
