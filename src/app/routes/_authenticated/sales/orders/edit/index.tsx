import { createFileRoute } from '@tanstack/react-router'
import OrderFormPage from '@/features/sales/orders/order-form'

export const Route = createFileRoute('/_authenticated/sales/orders/edit/')({
  component: OrderFormPage,
})
