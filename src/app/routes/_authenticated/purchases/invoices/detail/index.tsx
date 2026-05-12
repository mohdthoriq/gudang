import { createFileRoute } from '@tanstack/react-router'
import { InvoiceDetail } from '@/features/purchases/invoices/invoice-detail'

export const Route = createFileRoute(
  '/_authenticated/purchases/invoices/detail/'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <InvoiceDetail />
}
