import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardAction } from './card-action'
import type { Period } from '@/features/purchases/overview/types/purchases-overview'
import { useExpenseOverviewQuery } from '../hooks/use-dashboard-query'

interface ExpenseOverviewProps {
  externalPeriod?: Period
  externalDateRange?: DateRange
}

export function ExpenseOverview({
  externalPeriod,
  externalDateRange,
}: ExpenseOverviewProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    if (externalPeriod) {
      setPeriod(externalPeriod)
    }
  }, [externalPeriod])

  useEffect(() => {
    setDateRange(externalDateRange)
  }, [externalDateRange])

  const dateFromToUse = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : undefined
  const dateToToUse = dateRange?.to
    ? format(dateRange.to, 'yyyy-MM-dd')
    : undefined

  const { data } = useExpenseOverviewQuery({
    period: period,
    date_from: dateFromToUse as string,
    date_to: dateToToUse as string,
  })

  const chartData = data?.chart_data ?? []

  const formatYAxis = (value: number) => {
    return formatNumber(value)
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base font-semibold'>BIAYA</CardTitle>
        <CardAction
          period={period}
          dateRange={dateRange}
          setPeriod={setPeriod}
          setDateRange={setDateRange}
          onChange={(value) => setPeriod(value)}
        />
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex-1'>
          <div className='flex items-center justify-end gap-2'>
            <span className='text-muted-foreground text-sm'>
              Total Pengeluaran
            </span>
            <span className='text-sm font-semibold'>
              {formatCurrency(data?.value ?? 0)}
            </span>
          </div>
        </div>

        <ResponsiveContainer width='100%' height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='cashGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#ef4444' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='label'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              height={chartData.length > 10 ? 60 : 40}
              dy={15}
              tickMargin={12}
              interval={chartData.length > 10 ? 0 : 'preserveStartEnd'}
              angle={chartData.length > 10 ? -45 : 0}
              textAnchor={chartData.length > 10 ? 'end' : 'middle'}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              tickCount={7}
              axisLine={false}
              tickFormatter={formatYAxis}
              dx={12}
            />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#ffcd56'
              strokeWidth={2}
              fill='#ffcd56'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
