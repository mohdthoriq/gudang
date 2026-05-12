import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { useTopCustomerQuery } from '../hooks/use-sales-overview-query'

interface CustomerSalesCardProps {
  className?: string
  globalPeriod?: Period
}

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 60%)`
}

export function CustomerSalesCard({
  className,
  globalPeriod,
}: CustomerSalesCardProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    const syncPeriod = () => {
      if (globalPeriod && globalPeriod !== 'custom') {
        setPeriod(globalPeriod)
        setDateRange(undefined)
      }
    }
    syncPeriod()
  }, [globalPeriod])

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateRange(undefined)
    }
  }

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
          period:
            period === 'custom'
              ? 'month'
              : (period as 'day' | 'week' | 'month' | 'year'),
        }

  const { data: topCustomers, isLoading } = useTopCustomerQuery(queryParams)

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return 'HARI INI'
      case 'week':
        return 'MINGGU INI'
      case 'month':
        return 'BULAN INI'
      case 'year':
        return 'TAHUN INI'
      case 'custom':
        return 'PERIODE KUSTOM'
      default:
        return 'BULAN INI'
    }
  }

  const chartData = useMemo(() => {
    if (Array.isArray(topCustomers)) {
      return topCustomers
        .map((item) => ({
          name: item.name,
          value: item.total_sales,
          fill: generateRandomColor(),
        }))
        .slice(0, 5) // Take top 5 for the chart
    }
    return []
  }, [topCustomers])

  return (
    <Card
      className={cn(
        'bg-card border-border flex max-h-[500px] flex-col',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <h3 className='text-md font-semibold tracking-wide uppercase'>
          PENJUALAN PER CUSTOMER {getPeriodLabel()}
        </h3>
        <div className='flex items-center gap-1'>
          <CardAction
            period={period}
            onChange={handlePeriodChange}
            setDateRange={setDateRange}
            setPeriod={setPeriod}
            dateRange={dateRange}
          />
        </div>
      </CardHeader>

      <CardContent className='flex min-h-[300px] flex-1 flex-col items-center justify-center'>
        {isLoading ? (
          <div className='flex h-full items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        ) : chartData.length > 0 ? (
          <>
            <div className='relative h-[220px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    innerRadius={'30%'}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey='value'
                    stroke='none'
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      formatNumber(value || 0)
                    }
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className='mt-4 flex flex-wrap justify-center gap-4'>
              {chartData.map((entry, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className='h-5 w-12 rounded-sm'
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className='text-muted-foreground text-xs'>
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='text-muted-foreground text-sm'>No data available</div>
        )}

        {/* Pagination Dots Mockup */}
        <div className='mt-6 flex gap-2'>
          <div className='bg-muted h-2 w-2 rounded-full' />
          <div className='bg-primary/50 h-2 w-2 rounded-full' />
        </div>
      </CardContent>
    </Card>
  )
}
