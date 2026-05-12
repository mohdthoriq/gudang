import { createFileRoute } from '@tanstack/react-router'
import { PurchaseOverview } from '@/features/purchases/overview'

export const Route = createFileRoute('/_authenticated/purchases/overview/')({
  component: PurchaseOverview,
})
