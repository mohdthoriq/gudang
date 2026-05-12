import { format, parse, startOfMonth, endOfMonth } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { CalendarIcon, Printer, ArrowLeft, Loader2 } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { cn, formatCurrency } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PermissionGuard } from '@/components/permission-guard'
import { ReportSectionSkeleton } from '../balance-sheet/components/report-section-skeleton'
import { ProfitLossAccountDetailDialog } from './components/profit-loss-account-detail-dialog'
import { ProfitLossFallback } from './components/profit-loss-fallback'
import { usePrintProfitLossQuery } from './hooks/use-print-profit-loss-query'
// import { ProfitLossOverview } from './components/profit-loss-overview' // Placeholder if not implemented yet
import {
  ProfitLossProvider,
  useProfitLossContext,
} from './components/profit-loss-provider'
import { ReportSectionView } from './components/report-section-view'

const route = getRouteApi('/_authenticated/reports/profit-loss/')

export function ProfitLossPageContent() {
  const { dateFrom, dateTo, setDateRange, data, isLoading } =
    useProfitLossContext()
  const navigate = route.useNavigate()

  const handleSelectRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range.from, range.to)
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          date_from: format(range.from!, 'yyyy-MM-dd'),
          date_to: format(range.to!, 'yyyy-MM-dd'),
        }),
        replace: true,
      })
    }
  }

  // const handlePrintFromServer = () => {
  //   if (data?.print_url) {
  //     window.open(data.print_url, '_blank')
  //   } else {
  //     window.print()
  //   }
  // }

  const { refetch, isFetching: isPrinting } = usePrintProfitLossQuery(
    format(dateFrom, 'yyyy-MM-dd'),
    format(dateTo, 'yyyy-MM-dd')
  )

  const handlePrint = async () => {
    const { data: url } = await refetch()
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.REPORTS_PROFIT_LOSS_VIEW}
      fallback={<ProfitLossFallback />}
    >
      <div className='flex flex-col gap-10'>
        {/* Header - Screen Only */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight'>Laba Rugi</h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={() => handlePrint()}
              disabled={isPrinting || isLoading || !data}
            >
              {isPrinting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Printer className='h-4 w-4' />
              )}
              {isPrinting ? 'Memproses...' : 'Cetak'}
            </Button>
            <Button
              variant={'outline'}
              onClick={() => navigate({ to: '/reports' })}
            >
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
          </div>
        </div>

        <div className='flex items-center justify-end gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-between border-slate-200 p-3 text-left font-normal transition-colors hover:border-slate-400 hover:bg-slate-50/50'
                )}
              >
                <div className='flex items-center gap-2'>
                  <span>{format(dateFrom, 'dd/MM/yyyy')}</span>
                  <span className='text-muted-foreground'>→</span>
                  <span>{format(dateTo, 'dd/MM/yyyy')}</span>
                </div>
                <CalendarIcon className='h-4 w-4 text-slate-400' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='end'>
              <Calendar
                mode='range'
                selected={{ from: dateFrom, to: dateTo }}
                onSelect={handleSelectRange}
                required
                autoFocus
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Report Content */}
        <Card className='rounded-md border-none p-0'>
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='flex flex-col gap-10'>
                <ReportSectionSkeleton />
                <ReportSectionSkeleton />
                <ReportSectionSkeleton />
              </div>
            ) : data ? (
              <div className='flex flex-col gap-2'>
                <ReportSectionView
                  title='Pendapatan'
                  section={data.revenue}
                  totalLabel='Total Pendapatan'
                  date={dateTo}
                />
                <ReportSectionView
                  title='Beban Pokok Penjualan'
                  section={data.cogs}
                  totalLabel='Total Beban Pokok Penjualan'
                  date={dateTo}
                />

                <div className='mx-4 border-y'>
                  <div className='flex items-center justify-between p-5 text-lg font-bold uppercase'>
                    <span>Laba Kotor</span>
                    <span>
                      {data.gross_profit.total < 0
                        ? `(${formatCurrency(Math.abs(data.gross_profit.total))})`
                        : formatCurrency(data.gross_profit.total)}
                    </span>
                  </div>
                </div>

                <ReportSectionView
                  title='Biaya Operasional'
                  section={data.operating_expenses}
                  totalLabel='Total Biaya Operasional'
                  date={dateTo}
                />

                <div className='mx-4 border-y'>
                  <div className='flex items-center p-5 justify-between text-lg font-bold uppercase'>
                    <span>Laba Bersih</span>
                    <span>
                      {data.net_income.total < 0
                        ? `(${formatCurrency(Math.abs(data.net_income.total))})`
                        : formatCurrency(data.net_income.total)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-muted-foreground flex h-96 flex-col items-center justify-center space-y-4'>
                <div className='rounded-full bg-slate-200 p-4'>
                  <CalendarIcon className='h-10 w-10 text-slate-400' />
                </div>
                <p className='text-lg font-medium'>Tidak ada data ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>
        <ProfitLossAccountDetailDialog />
      </div>
    </PermissionGuard>
  )
}

export default function ProfitLossPage() {
  const search = route.useSearch() as { date_from?: string; date_to?: string }
  const defaultDateFrom = search.date_from
    ? parse(search.date_from, 'yyyy-MM-dd', new Date())
    : startOfMonth(new Date())
  const defaultDateTo = search.date_to
    ? parse(search.date_to, 'yyyy-MM-dd', new Date())
    : endOfMonth(new Date())

  return (
    <ProfitLossProvider
      defaultDateFrom={defaultDateFrom}
      defaultDateTo={defaultDateTo}
    >
      <ProfitLossPageContent />
    </ProfitLossProvider>
  )
}
