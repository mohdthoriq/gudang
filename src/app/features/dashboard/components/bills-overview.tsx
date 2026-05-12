import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardAction } from './card-action' 
import type { Period } from '@/features/purchases/overview/types/purchases-overview'
import { useUnpaidPurchaseOverviewQuery } from '../hooks/use-dashboard-query'

interface BillsOverviewProps {
  externalPeriod?: Period
  externalDateRange?: DateRange
}

export function BillsOverview({
  externalPeriod,
  externalDateRange,
}: BillsOverviewProps) {
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

  const { data } = useUnpaidPurchaseOverviewQuery({
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
        <CardTitle className='text-base font-semibold'>
          TAGIHAN YANG PERLU KAMU BAYAR
        </CardTitle>
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
              {data?.count ?? 0} Menunggu pembayaran
            </span>
            <span className='text-sm font-semibold'>
              {formatCurrency(data?.value ?? 0)}
            </span>
          </div>
        </div>

        <ResponsiveContainer width='100%' height={280}>
          <BarChart data={chartData}>
            <CartesianGrid stroke='#e5e5e5' className='stroke-[0.2px]' />
            <XAxis
              dataKey='label'
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              height={chartData.length > 10 ? 60 : 40}
              dy={15}
              tickMargin={10}
              interval={chartData.length > 10 ? 0 : 'preserveStartEnd'}
              angle={chartData.length > 10 ? -45 : 0}
              textAnchor={chartData.length > 10 ? 'end' : 'middle'}
            />
            <YAxis
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickCount={7}
              tickFormatter={formatYAxis}
              dx={12}
            />
            <Bar
              dataKey='value'
              fill='#ec4899'
              radius={[4, 4, 0, 0]}
              className='fill-red-400'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
