import { type UseFormReturn, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AccountCategory } from '@/types'
import {
  type CreateAccountCategoryFormData,
  type CreateAccountCategoryRequest,
  type UpdateAccountCategoryRequest,
  createAccountCategorySchema,
} from '../types/account-categories.schema'
import {
  useCreateAccountCategoryMutation,
  useUpdateAccountCategoryMutation,
} from './use-account-categories-mutation'

type useAccountCategoriesFormProps = {
  currentRow?: AccountCategory
}

export function useAccountCategoriesForm({
  currentRow,
}: useAccountCategoriesFormProps): {
  form: UseFormReturn<CreateAccountCategoryFormData>
  onSubmit: (data: CreateAccountCategoryFormData) => Promise<void>
  isSubmitting: boolean
} {
  const isEdit = !!currentRow
  const form = useForm<CreateAccountCategoryFormData>({
    resolver: zodResolver(createAccountCategorySchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          description: currentRow?.description,
          account_type: currentRow?.account_type,
          normal_balance: currentRow?.normal_balance,
          report_group: currentRow?.report_group,
          code_prefix: currentRow?.code_prefix,
          allowed_transactions:
            currentRow?.allowed_transactions?.map((t) => ({
              transaction_type_id: t.id,
            })) || [],
        }
      : {
          name: '',
          description: '',
          account_type: '',
          normal_balance: '',
          report_group: '',
          code_prefix: '',
          allowed_transactions: [],
        },
  })

  const createMutation = useCreateAccountCategoryMutation()
  const updateMutation = useUpdateAccountCategoryMutation()

  const onSubmit = async (data: CreateAccountCategoryFormData) => {
    // Transform objects to strings for the API
    const transformedData: CreateAccountCategoryRequest = {
      ...data,
      // Provide safe defaults for the backend enums if they are empty
      account_type: data.account_type || 'ASSET',
      normal_balance: data.normal_balance || 'DEBIT',
      report_group: data.report_group || 'BALANCE_SHEET',
      code_prefix: data.code_prefix || '0',
      allowed_transactions: data.allowed_transactions.map(
        (t) => t.transaction_type_id
      ),
    }

    if (isEdit && currentRow) {
      const updateData: UpdateAccountCategoryRequest = {
        id: currentRow.id,
        ...transformedData,
      }
      await updateMutation.mutateAsync(updateData)
      form.reset()
    } else {
      await createMutation.mutateAsync(transformedData)
      form.reset()
    }
  }

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  }
}
