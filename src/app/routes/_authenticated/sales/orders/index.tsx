import { createFileRoute } from '@tanstack/react-router'
import OrderLists from '@/features/sales/orders/order-lists'

export const Route = createFileRoute('/_authenticated/sales/orders/')({
  component: OrderLists,
})
