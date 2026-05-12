import { z } from 'zod'

export const createCompanyRoleSettingsSchema = z.object({
  company_id: z.string(),
  name: z.string(),
  description: z.string(),
  system_role: z.boolean(),
  is_default: z.boolean(),
  is_pos: z.boolean(),
  position: z.number().int().optional(),
  permission_ids: z.array(z.string()).optional(),
})

export type CreateCompanyRoleSettingsFormData = z.infer<
  typeof createCompanyRoleSettingsSchema
>

export const updateCompanyRoleSettingsSchema = z.object({
  id: z.string(),
  company_id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  system_role: z.boolean().optional(),
  is_default: z.boolean().optional(),
  is_pos: z.boolean().optional(),
  position: z.number().int().optional(),
  permission_ids: z.array(z.string()).optional(),
})

export type UpdateCompanyRoleSettingsFormData = z.infer<
  typeof updateCompanyRoleSettingsSchema
>

export const bulkDeleteCompanyRoleSettingsSchema = z.object({
  ids: z.array(z.uuid()),
})

export type BulkDeleteCompanyRoleSettingsFormData = z.infer<
  typeof bulkDeleteCompanyRoleSettingsSchema
>
