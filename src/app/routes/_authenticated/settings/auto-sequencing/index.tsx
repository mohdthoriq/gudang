import { createFileRoute } from '@tanstack/react-router'
import { AutoSequencing } from '@/features/settings/auto-sequencing'

export const Route = createFileRoute(
  '/_authenticated/settings/auto-sequencing/'
)({
  component: AutoSequencing,
})
