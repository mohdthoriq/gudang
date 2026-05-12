import { createFileRoute } from '@tanstack/react-router'
import { InvoiceDetail } from '@/features/sales/invoices/invoice-detail'

export const Route = createFileRoute('/_authenticated/sales/invoices/detail/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InvoiceDetail />
}
