import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Permission } from '@/types'
import {
  createPermissionSchema,
  type CreatePermissionFormData,
  type UpdatePermissionFormData,
} from '../types/permissions.schema'
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from './use-permissions-mutation'

type usePermissionsFormProps = {
  currentRow?: Permission
}

export function usePermissionsForm({ currentRow }: usePermissionsFormProps) {
  const isEdit = !!currentRow
  const form = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          description: currentRow?.description,
          parent_id: currentRow?.parent?.id || null,
          position: currentRow?.position || null,
        }
      : {
          name: '',
          description: '',
          parent_id: null,
          position: null,
        },
  })

  const createMutation = useCreatePermissionMutation()
  const updateMutation = useUpdatePermissionMutation()

  const onSubmit = async (data: CreatePermissionFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdatePermissionFormData = {
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
  }
}
