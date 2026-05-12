import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useTotalPurchasesQuery } from '../hooks/use-purchases-overview-query'
import type { Period } from '../types/purchases-overview'
import { CardAction } from './card-action'

interface SalesChartCardProps {
  className?: string
  globalPeriod?: Period
}

export function SalesChartCard({
  className,
  globalPeriod,
}: SalesChartCardProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const handleChangePeriod = () => {
      if (globalPeriod && globalPeriod !== 'custom') {
        setPeriod(globalPeriod)
        setDateRange(undefined)
      }
    }
    handleChangePeriod()
  }, [globalPeriod])

  const queryParams =
    period === 'custom' && dateRange?.from && dateRange?.to
      ? {
          date_from: format(dateRange.from, 'yyyy-MM-dd'),
          date_to: format(dateRange.to, 'yyyy-MM-dd'),
          period: 'day' as const,
        }
      : {
          date_from: '',
          date_to: '',
          period: period === 'custom' ? 'month' : period,
        }

  const { data, isLoading } = useTotalPurchasesQuery(queryParams)
  const chartData = data?.chart_data || []

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateRange(undefined)
    }
  }

  const formatYAxis = (value: number) => {
    return formatNumber(value)
  }

  return (
    <Card className={cn('bg-card border-border flex flex-col', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-md font-semibold tracking-wide uppercase'>
            Pembelian
          </h3>
          {period === 'custom' && dateRange?.from && dateRange?.to && (
            <span className='text-muted-foreground text-xs font-medium'>
              {format(dateRange.from, 'dd MMM yyyy', { locale: id })} -{' '}
              {format(dateRange.to, 'dd MMM yyyy', { locale: id })}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <CardAction
            period={period}
            dateRange={dateRange}
            setPeriod={setPeriod}
            setDateRange={setDateRange}
            onChange={handlePeriodChange}
          />
        </div>
      </CardHeader>
      <CardContent className='min-h-[400px] flex-1'>
        {isLoading ? (
          <div className='flex h-full items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                stroke='#3f3f46'
                vertical={false}
                strokeDasharray='3 3'
                className='stroke-muted/20'
              />
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
                tickCount={7}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b', // zinc-950
                  border: '1px solid #27272a', // zinc-800
                  borderRadius: '8px',
                  color: '#fafafa',
                }}
                itemStyle={{ color: '#fafafa' }}
                cursor={{ fill: '#27272a', opacity: 0.4 }}
              />
              <Bar
                name='Invoices'
                dataKey='value'
                fill='#2dd4bf' // teal-400
                radius={[2, 2, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
