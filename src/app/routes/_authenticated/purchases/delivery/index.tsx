import { createFileRoute } from '@tanstack/react-router'
import DeliveryLists from '@/features/purchases/delivery/delivery-lists'

export const Route = createFileRoute('/_authenticated/purchases/delivery/')({
  component: DeliveryLists,
})
