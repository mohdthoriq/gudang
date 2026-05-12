import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Account, ApiResponse } from '@/types'
import {
  type CreateAccountFormData,
  createAccountSchema,
  type UpdateAccountFormData,
} from '../types/account.schema'
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from './use-account-mutation'

export type UseAccountsFormProps = {
  currentRow?: (Partial<Account> & { category_id?: string; is_cash_bank?: boolean }) | null
  onSuccess?: (data: Account) => void
}

export function useAccountsForm({
  currentRow,
  onSuccess,
}: UseAccountsFormProps) {
  const isEdit = !!currentRow?.id
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          code: currentRow?.code ?? '',
          category_id: currentRow?.category?.id ?? '',
          parent_id: currentRow?.parent?.id ?? undefined,
          allow_transaction: currentRow?.allow_transaction ?? false,
          is_active: currentRow?.is_active ?? true,
          description: currentRow?.description ?? '',
        }
      : {
          name: '',
          code: '',
          category_id: currentRow?.category_id ?? '',
          parent_id: undefined,
          allow_transaction: false,
          is_active: true,
          description: '',
        },
  })

  const createMutation = useCreateAccountMutation(onSuccess)
  const updateMutation = useUpdateAccountMutation(onSuccess)

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = createMutation.error || updateMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CreateAccountFormData) => {
    const sanitizedData = {
      ...data,
      parent_id: data.parent_id || undefined, 
    }

    if (isEdit && currentRow) {
      const updateData: UpdateAccountFormData = {
        id: currentRow.id as string,
        ...sanitizedData,
        category_id: data.category_id || '',
      }
      await updateMutation.mutateAsync(updateData)
      form.reset()
    } else {
      await createMutation.mutateAsync(sanitizedData)
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
