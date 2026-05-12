import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { useTotalPaymentsQuery } from '../hooks/use-sales-overview-query'

interface PaymentChartCardProps {
  className?: string
  globalPeriod?: Period
}

export function PaymentChartCard({
  className,
  globalPeriod,
}: PaymentChartCardProps) {
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

  const { data, isLoading } = useTotalPaymentsQuery(queryParams)
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

  const formatTooltipValue = (value: number) => {
    return formatNumber(value)
  }

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-md font-semibold tracking-wide uppercase'>
            Pembayaran Diterima
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
      <CardContent>
        {isLoading ? (
          <div className='flex h-[400px] items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={400}>
            <LineChart data={chartData}>
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
                tickCount={7}
                axisLine={false}
                tickFormatter={formatYAxis}
                dx={1}
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
                formatter={(value: number | undefined) => [
                  formatTooltipValue(value || 0),
                  'Pembayaran',
                ]}
              />
              <Line
                type='linear'
                dataKey='value'
                stroke='#36a2eb'
                strokeWidth={3}
                animationEasing='ease-in-out'
                dot={{ fill: '#36a2eb', r: 4, strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
