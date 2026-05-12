import { useLocation, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useInvoiceFormQuery } from '../invoice-form/hooks/use-invoice-form-query'
import { InvoiceDetailReceipt } from './components/invoice-detail-receipt'
import { InvoicePaymentsCard } from './components/invoice-payments-card'
import { TransactionTable } from './components/transaction-table'

export function InvoiceDetail() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRowId = (location.state as { currentRowId?: string })
    ?.currentRowId

  const { data: invoice, isLoading } = useInvoiceFormQuery({ id: currentRowId })

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center font-medium'>
        Memuat data invoice...
      </div>
    )
  }

  if (!invoice) {
    return (
      <Card className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <CardContent>
          <p className='text-muted-foreground'>Data invoice tidak ditemukan.</p>
          <Button onClick={() => history.back()} variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Kembali
          </Button>
        </CardContent>
      </Card>
    )
  }

  const showTransactionTable =
    invoice.payment_status === 'paid' ||
    invoice.payment_status === 'partially_paid'

  return (
    <div className='space-y-4 font-sans'>
      <Card className='gap-1'>
        <CardHeader className='py-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold'>
                Detail Tagihan Pembelian {/* invoice.invoice_number */}
              </h1>
            </div>
            <div className='mr-4 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => navigate({ to: '/purchases/invoices' })}
                className='h-8 gap-2 px-3 text-xs'
              >
                <ArrowLeft className='h-3.5 w-3.5' /> Kembali
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <InvoiceDetailReceipt invoice={invoice} />
          <InvoicePaymentsCard invoice={invoice} />

          {showTransactionTable && (
            <TransactionTable
              payments={invoice.payments}
              currency={invoice.currency}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
