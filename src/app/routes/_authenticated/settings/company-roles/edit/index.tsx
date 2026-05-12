import { createFileRoute } from '@tanstack/react-router'
import { CompanyRolesFormPage } from '@/features/settings/company-roles/pages/company-roles-form-page'

export const Route = createFileRoute(
  '/_authenticated/settings/company-roles/edit/'
)({
  component: CompanyRolesFormPage,
})

