import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CompanyRoles } from '@/features/settings/company-roles'

const searchSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/settings/company-roles/')(
  {
    component: CompanyRoles,
    validateSearch: (search) => searchSchema.parse(search),
  }
)
