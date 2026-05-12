import { useRef, useState } from 'react'
import { Loader2, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionGuard } from '@/components/permission-guard'
import { Overdue } from './components/overdue'
import { PaidRatioCard } from './components/paid-ratio-card'
import { PaymentChartCard } from './components/payment-chart-card'
import { PaymentsReceived } from './components/payments-sent'
import { PurchaseOverviewPrint } from './components/print/purchase-overview-print'
import { ProductPurchasesCard } from './components/product-purchases-card'
import { SalesChartCard } from './components/purchases-chart-card'
import { PurchasesOverviewFallback } from './components/purchases-overview-fallback'
import { TotalPurchases } from './components/total-purchases'
import { VendorPurchasesCard } from './components/vendor-purchases-card'
import { WaitingPayments } from './components/waiting-payments'

export function PurchaseOverview() {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
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
      permission={PERMISSION_KEY.PURCHASE_OVERVIEW_VIEW}
      fallback={<PurchasesOverviewFallback />}
    >
      <div className='flex w-full flex-col items-center justify-between space-y-8'>
        <div className='flex w-full items-center justify-between mt-2'>
          <h1 className='text-3xl font-medium'>Overview Pembelian</h1>
          <Button
            variant='outline'
            className='gap-2 shadow-sm'
            onClick={handlePrint}
          >
            {isPrinting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Printer className='h-4 w-4' />
            )}{' '}
            {isPrinting ? 'Memproses...' : 'Cetak'}
          </Button>
        </div>
        <div className='flex w-full items-center justify-end'>
          <Tabs
            defaultValue='month'
            onValueChange={(v) => setPeriod(v as 'month' | 'year')}
          >
            <TabsList className='h-10 w-[200px]'>
              <TabsTrigger value='month'>Bulan</TabsTrigger>
              <TabsTrigger value='year'>Tahun</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='grid w-full grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2'>
            <TotalPurchases globalPeriod={period} />
            <PaymentsReceived globalPeriod={period} />
            <WaitingPayments globalPeriod={period} />
            <Overdue globalPeriod={period} />
            <SalesChartCard
              className='col-span-1 md:col-span-2'
              globalPeriod={period}
            />
            <PaymentChartCard
              className='col-span-1 md:col-span-2'
              globalPeriod={period}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <PaidRatioCard className='h-auto' globalPeriod={period} />
            <ProductPurchasesCard className='h-auto' globalPeriod={period} />
            <VendorPurchasesCard className='h-auto' globalPeriod={period} />
          </div>
        </div>
      </div>
      <div
        className={
          isPrinting
            ? 'absolute top-0 left-0 z-[-1] m-0 w-[210mm] min-w-[210mm] p-0'
            : 'hidden'
        }
      >
        <PurchaseOverviewPrint ref={printRef} />
      </div>
    </PermissionGuard>
  )
}
