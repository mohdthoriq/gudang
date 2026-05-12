import { useEffect } from 'react'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, Contact } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  type CreateContactFormData,
  type UpdateContactFormData,
  createContactSchema,
} from '../types/contacts.schema'
import {
  useCreateContactMutation,
  useUpdateContactMutation,
} from './use-contacts-mutation'

type useContactsFormProps = {
  currentRow?: Contact
  onSuccess?: (data: unknown) => void
}

export function useContactsForm({
  currentRow,
  onSuccess,
}: useContactsFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)

  const isEdit = !!currentRow
  const form = useForm<CreateContactFormData>({
    resolver: zodResolver(createContactSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name ?? '',
          type_id: currentRow?.type?.id ?? '',
          phone: currentRow?.phone ?? '',
          email: currentRow?.email ?? undefined,
          address: currentRow?.address ?? '',
          company_id: currentRow?.company?.id ?? company?.id ?? '',
          company_name: currentRow?.company_name ?? '',
        }
      : {
          company_id: company?.id ?? '',
          name: '',
          type_id: '',
          company_name: '',
          phone: '',
          email: undefined,
          address: '',
        },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        type_id: currentRow.type?.id ?? '',
        phone: currentRow.phone ?? '',
        email: currentRow.email ?? undefined,
        address: currentRow.address ?? '',
        company_id: currentRow.company?.id ?? company?.id ?? '',
        company_name: currentRow.company_name ?? '',
      })
    }
  }, [currentRow, form, company?.id])

  // Pass onSuccess to mutations if they support it, or handle it here
  const createMutation = useCreateContactMutation(onSuccess)
  const updateMutation = useUpdateContactMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateContactFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateContactFormData = {
        id: currentRow.id,
        name: data.name,
        type_id: data.type_id,
        phone: data.phone,
        email: data.email,
        address: data.address,
        company_id: data.company_id,
        company_name: data.company_name,
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
