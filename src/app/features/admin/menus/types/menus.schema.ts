import { z } from 'zod'

export const createMenusSchema = z.object({
  name: z.string(),
  title: z.string(),
  parent_id: z.string().optional().nullable(),
  position: z.number(),
  icon: z.string(),
  url: z.string(),
  permission_id: z.string().optional().nullable(),
  is_divider: z.boolean(),
  is_active: z.boolean(),
  category_id: z.string().optional().nullable(),
})

export type CreateMenusFormData = z.infer<typeof createMenusSchema>

export const updateMenusSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  title: z.string(),
  parent_id: z.string().optional().nullable(),
  position: z.number(),
  icon: z.string(),
  url: z.string(),
  permission_id: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  is_divider: z.boolean(),
  is_active: z.boolean(),
})

export type UpdateMenusFormData = z.infer<typeof updateMenusSchema>

export const deleteMenusSchema = z.object({
  id: z.uuid(),
})

export type DeleteMenusFormData = z.infer<typeof deleteMenusSchema>

export const bulkDeleteMenusSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteMenusFormData = z.infer<typeof bulkDeleteMenusSchema>
