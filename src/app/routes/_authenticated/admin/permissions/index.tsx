import { createFileRoute } from '@tanstack/react-router'
import Permissions from '@/features/admin/permissions'

export const Route = createFileRoute('/_authenticated/admin/permissions/')({
  component: Permissions,
})
