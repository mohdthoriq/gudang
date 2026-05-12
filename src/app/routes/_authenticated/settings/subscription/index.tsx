import { createFileRoute } from '@tanstack/react-router'
import { SubscriptionPage } from '@/features/settings/subscription'

export const Route = createFileRoute(
  '/_authenticated/settings/subscription/'
)({
  component: SubscriptionPage,
})
