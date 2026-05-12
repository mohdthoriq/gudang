import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Unit } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  createUnitSchema,
  type CreateUnitFormData,
  type UpdateUnitFormData,
} from '@/features/settings/units/types/units.schema'
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
} from './use-units-mutation'
import type { AxiosError } from 'axios'

type useUnitsFormProps = {
  currentRow?: Unit
  onSuccess?: (data: Unit) => void
}

export function useUnitsForm({ currentRow, onSuccess }: useUnitsFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)

  const isEdit = !!currentRow
  const form = useForm<CreateUnitFormData>({
    resolver: zodResolver(createUnitSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          code: currentRow?.code,
          company_id: currentRow?.company?.id ?? company?.id ?? '',
        }
      : {
          company_id: company?.id ?? '',
          name: '',
          code: '',
        },
  })

  const createMutation = useCreateUnitMutation(onSuccess)
  const updateMutation = useUpdateUnitMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateUnitFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateUnitFormData = {
        id: currentRow.id,
        name: data.name,
        code: data.code,
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
