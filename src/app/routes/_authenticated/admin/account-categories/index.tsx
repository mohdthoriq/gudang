import { createFileRoute } from '@tanstack/react-router'
import AccountCategories from '@/features/admin/account-categories'

export const Route = createFileRoute(
  '/_authenticated/admin/account-categories/'
)({
  component: AccountCategories,
})
