import { useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Loader2, Plus, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { PurchaseInvoiceListFallback } from './components/invoice-list-fallback'
import { InvoiceListsProvider } from './components/invoice-list-provider'
import { InvoiceListsTable } from './components/invoice-list-table'
import { PurchaseInvoicesTablePrint } from './components/print/purchase-invoices-list-print'
import type { InvoiceListQueryParams } from './hooks/use-invoice-list-query'

const route = getRouteApi('/_authenticated/purchases/invoices/')

function InvoiceListsContent() {
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
      permission={PERMISSION_KEY.PURCHASE_INVOICE}
      fallback={
        <PurchaseInvoiceListFallback search={search} navigate={navigate} />
      }
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Tagihan Pembelian
              </h2>
              <p className='text-muted-foreground'>Kelola Tagihan Pembelian.</p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button
                onClick={() => navigate({ to: '/purchases/invoices/add' })}
              >
                <Plus className='h-4 w-4' />
                Tambah Tagihan
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
          <InvoiceListsTable search={search} navigate={navigate} />
        </CardContent>
        <div
          className={
            isPrinting ? 'absolute top-0 left-0 z-[-1] m-0 w-fit p-0' : 'hidden'
          }
        >
          <PurchaseInvoicesTablePrint ref={printRef} />
        </div>
      </Card>
    </PermissionGuard>
  )
}

function InvoiceLists() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: InvoiceListQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: (search.search as string) || undefined,
    date_from: search?.date_from ? new Date(search.date_from) : undefined,
    date_to: search?.date_to ? new Date(search.date_to) : undefined,
    due_date_from: search?.due_date_from
      ? new Date(search.due_date_from)
      : undefined,
    due_date_to: search?.due_date_to ? new Date(search.due_date_to) : undefined,
    payment_date_from: search?.payment_date_from
      ? new Date(search.payment_date_from)
      : undefined,
    payment_date_to: search?.payment_date_to
      ? new Date(search.payment_date_to)
      : undefined,
    vendor_id: search?.vendor_id,
    tags: search.tags ? (search.tags as string).split(',') : undefined,
    payment_status:
      (search.payment_status as InvoiceListQueryParams['payment_status']) ||
      undefined,
  }

  return (
    <InvoiceListsProvider paginationParams={queryParams}>
      <InvoiceListsContent />
    </InvoiceListsProvider>
  )
}

export default InvoiceLists
