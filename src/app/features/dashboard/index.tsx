import { useRef, useState } from 'react'
import { Loader2, Printer } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/permission-guard'
import type { Period } from '@/features/purchases/overview/types/purchases-overview'
import { BillsOverview } from './components/bills-overview'
import { CashOverview } from './components/cash-overview'
import { DashboardFallback } from './components/dashboard-fallback'
import { DashboardGlobalFilter } from './components/dashboard-global-filter'
import { ExpenseOverview } from './components/expense-overview'
import { DashboardPrint } from './components/print/dashboard-print'
import { SalesDashboardOverview } from './components/sales-overview'

export function Dashboard() {
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  // Global filter state
  const [globalPeriod, setGlobalPeriod] = useState<Period>('month')
  const [globalDateRange, setGlobalDateRange] = useState<DateRange | undefined>(
    undefined
  )

  // const globalDateFrom = globalDateRange?.from
  //   ? format(globalDateRange.from, 'yyyy-MM-dd')
  //   : undefined
  // const globalDateTo = globalDateRange?.to
  //   ? format(globalDateRange.to, 'yyyy-MM-dd')
  //   : undefined

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
      permission={PERMISSION_KEY.DASHBOARD_VIEW}
      fallback={<DashboardFallback />}
    >
      <div>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div className='flex items-center justify-end w-full space-x-2'>
            <DashboardGlobalFilter
              period={globalPeriod}
              dateRange={globalDateRange}
              setPeriod={setGlobalPeriod}
              setDateRange={setGlobalDateRange}
            />
            <Button
              variant='outline'
              className='gap-2 shadow-sm'
              onClick={() => handlePrint()}
              disabled={isPrinting}
            >
              {isPrinting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Printer className='h-4 w-4' />
              )}{' '}
              {isPrinting ? 'Memproses...' : 'Cetak'}
            </Button>
          </div>
        </div>
        <div className='grid gap-x-4 gap-y-6 sm:grid-cols-1 lg:grid-cols-2'>
          <CashOverview
            externalPeriod={globalPeriod}
            externalDateRange={globalDateRange}
          />
          <BillsOverview
            externalPeriod={globalPeriod}
            externalDateRange={globalDateRange}
          />
          <SalesDashboardOverview
            externalPeriod={globalPeriod}
            externalDateRange={globalDateRange}
          />
          <ExpenseOverview
            externalPeriod={globalPeriod}
            externalDateRange={globalDateRange}
          />
        </div>
      </div>
      <div
        className={
          isPrinting
            ? 'absolute top-0 left-0 z-[-1] m-0 w-[210mm] min-w-[210mm] p-0'
            : 'hidden'
        }
      >
        <DashboardPrint ref={printRef} />
      </div>
    </PermissionGuard>
  )
}
