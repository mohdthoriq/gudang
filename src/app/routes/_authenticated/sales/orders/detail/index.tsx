import { createFileRoute } from '@tanstack/react-router'
import OrderDetail from '@/features/sales/orders/order-detail'

export const Route = createFileRoute('/_authenticated/sales/orders/detail/')({
  component: OrderDetail,
})
