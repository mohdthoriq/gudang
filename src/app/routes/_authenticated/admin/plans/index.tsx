import { createFileRoute } from '@tanstack/react-router'
import Plans from '@/features/admin/plans'

export const Route = createFileRoute('/_authenticated/admin/plans/')({
  component: Plans,
})
