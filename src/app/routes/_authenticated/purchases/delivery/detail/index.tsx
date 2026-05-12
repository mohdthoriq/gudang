import { createFileRoute } from '@tanstack/react-router'
import { PurchaseDeliveryDetail } from '@/features/purchases/delivery/delivery-detail'

export const Route = createFileRoute('/_authenticated/purchases/delivery/detail/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PurchaseDeliveryDetail />
}
