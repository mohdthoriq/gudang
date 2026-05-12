import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Menu } from '@/types';
import { createMenusSchema, type CreateMenusFormData, type UpdateMenusFormData } from '../types/menus.schema';
import { useCreateMenuMutation, useUpdateMenuMutation } from './use-menus-mutation';


type useMenusFormProps = {
  currentRow?: Menu
}

export function useMenusForm({ currentRow }: useMenusFormProps) {
  const isEdit = !!currentRow
  const form = useForm<CreateMenusFormData>({
    resolver: zodResolver(createMenusSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          title: currentRow?.title,
          icon: currentRow?.icon,
          url: currentRow?.url,
          parent_id: currentRow?.parent?.id || undefined,
          position: currentRow?.position,
          is_divider: currentRow?.is_divider,
          is_active: currentRow?.is_active,
          permission_id: currentRow?.permission?.id || undefined,
          category_id: currentRow?.category?.id || undefined,
        }
      : {
          name: '',
          title: '',
          icon: '',
          url: '',
          parent_id: undefined,
          position: 0,
          is_divider: false,
          is_active: true,
          permission_id: undefined,
          category_id: undefined,
        },
  })

  const createMutation = useCreateMenuMutation()
  const updateMutation = useUpdateMenuMutation()

  const onSubmit = async (data: CreateMenusFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateMenusFormData = {
        id: currentRow.id,
        name: data.name,
        title: data.title,
        icon: data.icon,
        url: data.url,
        parent_id: data.parent_id || null,
        position: data.position,
        is_divider: data.is_divider,
        is_active: data.is_active,
        permission_id: data.permission_id || undefined,
        category_id: data.category_id || undefined,
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