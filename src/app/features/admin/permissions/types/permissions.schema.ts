import { z } from 'zod'

export const createPermissionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parent_id: z.string().optional().nullable(),
  position: z.number().optional().nullable(),
})

export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>

export const updatePermissionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  parent_id: z.string().optional().nullable(),
  position: z.number().optional().nullable(),
})

export type UpdatePermissionFormData = z.infer<typeof updatePermissionSchema>

export const deletePermissionSchema = z.object({
  id: z.uuid(),
})

export type DeletePermissionFormData = z.infer<typeof deletePermissionSchema>

export const bulkDeletePermissionSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeletePermissionFormData = z.infer<
  typeof bulkDeletePermissionSchema
>
