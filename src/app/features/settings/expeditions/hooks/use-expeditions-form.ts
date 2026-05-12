import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Expedition } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  createExpeditionSchema,
  type CreateExpeditionFormData,
  type UpdateExpeditionFormData,
} from '@/features/settings/expeditions/types/expeditions.schema'
import {
  useCreateExpeditionMutation,
  useUpdateExpeditionMutation,
} from './use-expeditions-mutation'
import type { AxiosError } from 'axios'

type useExpeditionsFormProps = {
  currentRow?: Expedition
  onSuccess?: (data: Expedition) => void
}

export function useExpeditionsForm({ currentRow, onSuccess }: useExpeditionsFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)

  const isEdit = !!currentRow
  const form = useForm<CreateExpeditionFormData>({
    resolver: zodResolver(createExpeditionSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name ?? '',
          is_active: currentRow?.is_active ?? true,
          company_id: currentRow?.company_id ?? company?.id ?? '',
        }
      : {
          company_id: company?.id ?? '',
          name: '',
          is_active: true,
        },
  })

  const createMutation = useCreateExpeditionMutation(onSuccess)
  const updateMutation = useUpdateExpeditionMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateExpeditionFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateExpeditionFormData = {
        id: currentRow.id,
        name: data.name,
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
