import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { AdminDashboardChart } from './components/admin-dashboard-chart'
import { AdminDashboardPrint } from './components/print/admin-dashboard-print'
import { SubscriptionOverview } from './components/subscription-overview'
import { SummaryCards } from './components/summary-cards'
import { useAdminDashboardQuery } from './hooks/use-admin-dashboard-query'

export function AdminDashboard() {
  const navigate = useNavigate({ from: '/admin/dashboard' })
  const search = useSearch({ from: '/_authenticated/admin/dashboard/' })

  const { period, year, month } = search

  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useAdminDashboardQuery({
    period,
    year,
    month: period === 'month' ? month : undefined,
  })

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

  const updateFilters = (updates: Partial<typeof search>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
      }),
      replace: true,
    })
  }

  const chartData = useMemo(() => {
    if (!data?.chart_data) return []

    const monthShortLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    }

    let result = [...data.chart_data]

    // KRITIKAL: Hanya filter jadi 1 bar JIKA user memilih bulan spesifik (month > 0).
    // Jika user pilih '6 Bulan Terakhir' (month === 0), maka jangan di-filter (tampilkan semua).
    if (period === 'month' && month !== undefined && month !== null && Number(month) > 0) {
      const targetLabel = `${monthShortLabels[Number(month) - 1]} ${year}`
      result = result.filter((item) => item.label === targetLabel)
    }

    return result.sort((a, b) => {
      const [monthA, yearA] = a.label.split(' ')
      const [monthB, yearB] = b.label.split(' ')

      const dateA = new Date(parseInt(yearA), months[monthA] ?? 0)
      const dateB = new Date(parseInt(yearB), months[monthB] ?? 0)

      return dateA.getTime() - dateB.getTime()
    })
  }, [data, period, month, year])

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-2 shadow-sm'
            onClick={() => handlePrint()}
            disabled={isPrinting || isLoading}
          >
            {isPrinting ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Printer className='h-3.5 w-3.5' />
            )}
            <span className='hidden sm:inline'>
              {isPrinting ? 'Memproses...' : 'Cetak'}
            </span>
          </Button>
        </div>
      </div>

      <SummaryCards summary={data?.summary} isLoading={isLoading} />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <AdminDashboardChart
          chartData={chartData}
          isLoading={isLoading}
          period={period}
          year={year}
          month={month}
          onFilterChange={updateFilters}
        />
        <SubscriptionOverview
          subscriptionByPlan={data?.subscription_by_plan}
          isLoading={isLoading}
        />
      </div>

      <div
        className={
          isPrinting
            ? 'absolute top-0 left-0 z-[-1] m-0 w-[210mm] min-w-[210mm] p-0'
            : 'hidden'
        }
      >
        <AdminDashboardPrint
          ref={printRef}
          data={data}
          chartData={chartData}
          isLoading={isLoading}
          period={period}
          year={year}
          month={month}
        />
      </div>
    </div>
  )
}
