import { createFileRoute } from '@tanstack/react-router'
import { UserSettings } from '@/features/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/profile/')({
  component: UserSettings,
})
