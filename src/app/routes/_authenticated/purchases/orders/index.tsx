import { createFileRoute } from '@tanstack/react-router'
import OrderLists from '@/features/purchases/orders/order-lists'

export const Route = createFileRoute('/_authenticated/purchases/orders/')({
  component: OrderLists,
})
