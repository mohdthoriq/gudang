import { createFileRoute } from '@tanstack/react-router'
import OrderFormPage from '@/features/purchases/orders/order-form'

export const Route = createFileRoute('/_authenticated/purchases/orders/add/')({
  component: OrderFormPage,
})
