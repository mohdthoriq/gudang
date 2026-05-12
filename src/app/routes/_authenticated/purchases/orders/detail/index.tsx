import { createFileRoute } from '@tanstack/react-router'
import OrderDetail from '@/features/purchases/orders/order-detail'

export const Route = createFileRoute('/_authenticated/purchases/orders/detail/')({
  component: OrderDetail,
})
