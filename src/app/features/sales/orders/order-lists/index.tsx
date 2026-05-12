import { useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2, Plus, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { OrderListFallback } from './components/order-list-fallback'
import { OrderListsProvider } from './components/order-list-provider'
import { OrderListsTable } from './components/order-list-table'
import { SalesOrdersTablePrint } from './components/print/sales-orders-table-print'
import type { SalesOrderListQueryParams } from './hooks/use-sales-order-list-query'

const route = getRouteApi('/_authenticated/sales/orders/')

function OrderListsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: async () => {
      setIsPrinting(true)
      return new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
    },
    onAfterPrint: () => {
      setIsPrinting(false)
    },
  })

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SALES_ORDER}
      fallback={<OrderListFallback search={search} navigate={navigate} />}
    >
      <Card className='relative'>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>Pesanan Penjualan</h2>
              <p className='text-muted-foreground'>Kelola Pesanan Penjualan.</p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button onClick={() => navigate({ to: '/sales/orders/add' })}>
                <Plus className='h-4 w-4' />
                Tambah Pesanan
              </Button>
              <Button variant={'outline'} onClick={() => handlePrint()}>
                {isPrinting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Printer className='h-4 w-4' />
                )}{' '}
                {isPrinting ? 'Memproses...' : 'Cetak'}
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <OrderListsTable search={search} navigate={navigate} />
        </CardContent>
        <div
          className={
            isPrinting ? 'absolute top-0 left-0 z-[-1] m-0 w-fit p-0' : 'hidden'
          }
        >
          <SalesOrdersTablePrint ref={printRef} />
        </div>
      </Card>
    </PermissionGuard>
  )
}

function OrderLists() {
  const search = route.useSearch() as Record<string, unknown>

  const queryParams: SalesOrderListQueryParams = {
    page: search.page ? parseInt(search.page as string) : undefined,
    limit: search.limit ? parseInt(search.limit as string) : undefined,
    search: (search.search as string) || undefined,
    payment_status:
      (search.payment_status as SalesOrderListQueryParams['payment_status']) ||
      undefined,
    document_status:
      (search.document_status as SalesOrderListQueryParams['document_status']) ||
      undefined,
    customer_id: (search.customer_id as string) || undefined,
    company_id: (search.company_id as string) || undefined,
    order: (search.order as string) || undefined,
    date_from: search.date_from
      ? new Date(search.date_from as string)
      : undefined,
    date_to: search.date_to ? new Date(search.date_to as string) : undefined,
    due_date_from: search.due_date_from
      ? new Date(search.due_date_from as string)
      : undefined,
    due_date_to: search.due_date_to
      ? new Date(search.due_date_to as string)
      : undefined,
    payment_date_from: search.payment_date_from
      ? new Date(search.payment_date_from as string)
      : undefined,
    payment_date_to: search.payment_date_to
      ? new Date(search.payment_date_to as string)
      : undefined,
    tags: search.tags ? (search.tags as string).split(',') : undefined,
    sales_person_id: (search.sales_person_id as string) || undefined,
    category_id: (search.category_id as string) || undefined,
    product_id: (search.product_id as string) || undefined,
    payment_term_id: (search.payment_term_id as string) || undefined,
    expedition_id: (search.expedition_id as string) || undefined,
    has_attachment: (search.has_attachment as string) || undefined,
  }

  return (
    <OrderListsProvider paginationParams={queryParams}>
      <OrderListsContent />
    </OrderListsProvider>
  )
}

export default OrderLists
