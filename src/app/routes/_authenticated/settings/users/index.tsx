import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/settings/users'

export const Route = createFileRoute('/_authenticated/settings/users/')({
  component: Users,
})
