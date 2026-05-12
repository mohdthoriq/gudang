import { createFileRoute } from '@tanstack/react-router'
import { SalesDeliveryDetail } from '@/features/sales/delivery/delivery-detail'

export const Route = createFileRoute('/_authenticated/sales/delivery/detail/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SalesDeliveryDetail />
}
