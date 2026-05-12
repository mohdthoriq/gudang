import { format, parse } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { id } from 'date-fns/locale'
import { ArrowLeft, CalendarIcon, Loader2, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionGuard } from '@/components/permission-guard'
import { BalanceSheetAccountDetailDialog } from './components/balance-sheet-account-detail-dialog'
import { BalanceSheetFallback } from './components/balance-sheet-fallback'
import { BalanceSheetOverview } from './components/balance-sheet-overview'
import {
  BalanceSheetOverviewProvider,
  useBalanceSheetOverviewContext,
} from './components/balance-sheet-overview-provider'
import {
  BalanceSheetProvider,
  useBalanceSheetContext,
} from './components/balance-sheet-provider'
import { ReportSectionSkeleton } from './components/report-section-skeleton'
import { ReportSectionView } from './components/report-section-view'
import { usePrintBalanceSheetQuery } from './hooks/use-print-balance-sheet-query'

const route = getRouteApi('/_authenticated/reports/balance-sheet/')

export function BalanceSheetPageContent() {
  const { date, setDate, data: rawData, isLoading } = useBalanceSheetContext()
  const navigate = route.useNavigate()
  const reportDate = format(date, 'yyyy-MM-dd')
  const data = rawData?.[reportDate]

  const { refetch, isFetching: isPrinting } =
    usePrintBalanceSheetQuery(reportDate)

  const handlePrint = async () => {
    const { data: url } = await refetch()
    if (url) {
      window.open(url, '_blank')
    }
  }

  const handleSelectDate = (d: Date) => {
    setDate(d)
    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        date: format(d, 'yyyy-MM-dd'),
      }),
      replace: true,
    })
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex items-center justify-end gap-3'>
        <Button
          variant='outline'
          className='gap-2'
          onClick={() => handlePrint()}
          disabled={
            isPrinting || isLoading || !data || typeof data === 'string'
          }
        >
          {isPrinting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Printer className='h-4 w-4' />
          )}
          {isPrinting ? 'Memproses...' : 'Cetak'}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal transition-colors hover:border-blue-400 hover:bg-blue-50/50',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='h-4 w-4' />
              {date ? (
                format(date, 'd MMMM yyyy', { locale: id })
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={handleSelectDate}
              required
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card className='rounded-md border-none p-0'>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='flex flex-col gap-10'>
              <ReportSectionSkeleton />
              <ReportSectionSkeleton />
            </div>
          ) : data && typeof data !== 'string' ? (
            <div className='flex flex-col gap-6'>
              {/* Assets Section */}
              <div>
                <ReportSectionView
                  title='Aset'
                  date={date}
                  section={data.assets}
                  totalLabel='Total Aset'
                />
              </div>

              {/* Liabilities and Equity Section */}
              <div>
                <ReportSectionView
                  title='Liabilitas dan Modal'
                  date={date}
                  section={data.liabilities_equity}
                  totalLabel='Total Liabilitas & Modal'
                />
              </div>
            </div>
          ) : (
            <div className='text-muted-foreground flex h-96 flex-col items-center justify-center space-y-4'>
              <div className='bg-background rounded-full p-4'>
                <CalendarIcon className='text-muted-foreground h-10 w-10' />
              </div>
              <p className='text-lg font-medium'>Tidak ada data ditemukan</p>
              <p className='max-w-xs text-center text-sm'>
                Silakan pilih tanggal lain atau pastikan transaksi sudah dicatat
                untuk periode ini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <BalanceSheetAccountDetailDialog />
    </div>
  )
}

export function BalanceSheetOverviewWithFilters() {
  const { date, setDate, period, setPeriod } = useBalanceSheetOverviewContext()
  return (
    <div className='flex flex-col gap-10'>
      <div className='flex items-center justify-end gap-3'>
        <Tabs
          value={period === 'year' ? 'yearly' : 'monthly'}
          onValueChange={(v) => setPeriod(v === 'yearly' ? 'year' : 'month')}
        >
          <TabsList className='h-10'>
            <TabsTrigger value='monthly'>Bulanan</TabsTrigger>
            <TabsTrigger value='yearly'>Tahunan</TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal transition-colors hover:border-blue-400 hover:bg-blue-50/50',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='h-4 w-4' />
              {date ? (
                format(date, 'd MMMM yyyy', { locale: id })
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(d) => d && setDate(d)}
              required
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <BalanceSheetOverview />
    </div>
  )
}

export default function BalanceSheetPage() {
  const search = route.useSearch() as { date?: string }
  const navigate = route.useNavigate()

  const defaultDate = search.date
    ? parse(search.date, 'yyyy-MM-dd', new Date())
    : new Date()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.REPORTS_BALANCE_SHEET_VIEW}
      fallback={<BalanceSheetFallback />}
    >
      <div className='flex flex-col gap-10'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight'>Neraca</h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant={'outline'}
              onClick={() => navigate({ to: '/reports' })}
            >
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
          </div>
        </div>

        <BalanceSheetOverviewProvider defaultDate={defaultDate}>
          <BalanceSheetOverviewWithFilters />
        </BalanceSheetOverviewProvider>

        <BalanceSheetProvider defaultDate={defaultDate}>
          <BalanceSheetPageContent />
        </BalanceSheetProvider>
      </div>
    </PermissionGuard>
  )
}
