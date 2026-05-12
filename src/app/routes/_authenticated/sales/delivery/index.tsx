import { createFileRoute } from '@tanstack/react-router'
import DeliveryLists from '@/features/sales/delivery/delivery-lists'

export const Route = createFileRoute('/_authenticated/sales/delivery/')({
  component: DeliveryLists,
})
