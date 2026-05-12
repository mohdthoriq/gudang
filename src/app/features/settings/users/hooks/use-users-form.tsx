import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse, User } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  type CreateUserFormData,
  createUserSchema,
  type UpdateUserFormData,
} from '../types/users.schema'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from './use-users-mutation'
import { useEffect } from 'react'

type useUsersFormProps = {
  currentRow?: User
}

export function useUsersForm({ currentRow }: useUsersFormProps) {
  const company = useAuthStore((state) => state.auth.user?.company)
  const isEdit = !!currentRow

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: isEdit
      ? {
          email: currentRow?.email ?? '',
          full_name: currentRow?.full_name ?? '',
          role_id: currentRow?.role?.id ?? '',
          phone: currentRow?.phone ?? '',
          company_id: currentRow?.company?.id ?? company?.id ?? '',
        }
      : {
          email: '',
          full_name: '',
          role_id: '',
          phone: '',
          company_id: company?.id ?? '',
        },
  })

  useEffect(() => {
    if (!isEdit && company?.id) {
      form.setValue('company_id', company.id)
    }
  }, [company?.id, isEdit, form])

  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = isEdit ? updateMutation.error : createMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      if (isEdit && currentRow) {
        const updateData: UpdateUserFormData = {
          id: currentRow.id,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          role_id: data.role_id,
        }
        await updateMutation.mutateAsync(updateData)
      } else {
        await createMutation.mutateAsync(data)

        form.reset({
          email: '',
          full_name: '',
          role_id: '',
          phone: '',
          company_id: company?.id ?? '',
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Submit error:', error)
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: isEdit ? updateMutation.isPending : createMutation.isPending,
    errorMessage,
  }
}
