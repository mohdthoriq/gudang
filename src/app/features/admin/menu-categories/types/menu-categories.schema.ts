import { z } from 'zod'

export const createMenuCategoriesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.number().int().min(0),
  type: z.string().min(1, 'Type is required'),
})

export type CreateMenuCategoriesFormData = z.infer<
  typeof createMenuCategoriesSchema
>

export const updateMenuCategoriesSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  position: z.number().int().min(0),
  type: z.string().min(1, 'Type is required'),
})

export type UpdateMenuCategoriesFormData = z.infer<
  typeof updateMenuCategoriesSchema
>

export const deleteMenuCategoriesSchema = z.object({
  id: z.uuid(),
})

export type DeleteMenuCategoriesFormData = z.infer<
  typeof deleteMenuCategoriesSchema
>

export const bulkDeleteMenuCategoriesSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteMenuCategoriesFormData = z.infer<
  typeof bulkDeleteMenuCategoriesSchema
>
