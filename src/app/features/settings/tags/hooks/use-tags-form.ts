import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Tag } from '@/types'
import {
  createTagSchema,
  type CreateTagFormData,
  type UpdateTagFormData,
} from '@/features/settings/tags/types/tags.schema'
import { useCreateTagMutation, useUpdateTagMutation } from './use-tags-mutation'
import type { AxiosError } from 'axios'

type useTagsFormProps = {
  currentRow?: Tag
  onSuccess?: (result: Tag) => void
}

export function useTagsForm({ currentRow, onSuccess }: useTagsFormProps) {
  const isEdit = !!currentRow
  const form = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          description: currentRow?.description,
        }
      : {
          name: '',
          description: '',
        },
  })

  const createMutation = useCreateTagMutation(onSuccess)
  const updateMutation = useUpdateTagMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateTagFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateTagFormData = {
        id: currentRow.id,
        name: data.name,
        description: data.description,
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
