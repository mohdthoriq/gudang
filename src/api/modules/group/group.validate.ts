import { z } from 'zod'

export const createGroupSchema = z.object({
    name: z.string().min(1, 'Nama group is required')
})

export const updateGroupSchema = z.object({
    name: z.string().min(1, 'Nama group is required')
})

export const bulkDeleteGroupSchema = z.object({
    ids: z.array(z.number()).min(1, 'Minimal 1 group')
})

export const queryGroupSchema = z.object({
    search: z.string().optional(),
    limit: z.string().optional().default('10'),
    page: z.string().optional().default('1')
})

export type CreateGroupDTO = z.infer<typeof createGroupSchema>
export type UpdateGroupDTO = z.infer<typeof updateGroupSchema>
export type BulkDeleteGroupDTO = z.infer<typeof bulkDeleteGroupSchema>
export type QueryGroupDTO = z.infer<typeof queryGroupSchema>