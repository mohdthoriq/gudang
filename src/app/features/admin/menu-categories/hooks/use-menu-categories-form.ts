import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type MenuCategory } from '@/types';
import { createMenuCategoriesSchema, type CreateMenuCategoriesFormData, type UpdateMenuCategoriesFormData } from '../types/menu-categories.schema';
import { useCreateMenuCategoryMutation, useUpdateMenuCategoryMutation } from './use-menu-categories-mutation';

type useMenuCategoriesFormProps = {
  currentRow?: MenuCategory
}

export function useMenuCategoriesForm({ currentRow }: useMenuCategoriesFormProps) {
  const isEdit = !!currentRow
  const form = useForm<CreateMenuCategoriesFormData>({
    resolver: zodResolver(createMenuCategoriesSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name,
          position: currentRow?.position,
          type: currentRow?.type,
        }
      : {
          name: '',
          position: 0,
          type: '',
        },
  })

  const createMutation = useCreateMenuCategoryMutation()
  const updateMutation = useUpdateMenuCategoryMutation()

  const onSubmit = async (data: CreateMenuCategoriesFormData) => {
    if (isEdit && currentRow) {
      const updateData: UpdateMenuCategoriesFormData = {
        id: currentRow.id,
        name: data.name,
        position: data.position,
        type: data.type,
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
