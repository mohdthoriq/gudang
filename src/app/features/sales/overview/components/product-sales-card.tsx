import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Period } from '../types/sales-overview'
import { CardAction } from './card-action'
import { useTopProductsQuery } from '../hooks/use-sales-overview-query'

interface ProductSalesCardProps {
  className?: string
  globalPeriod?: Period
}

// Recharts tidak memiliki built-in random color, jadi kita buat helper function
// Menggunakan HSL agar warna tetap cerah dan 'aesthetic' (Saturation 70%, Lightness 60%)
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 60%)`
}

export function ProductSalesCard({
  className,
  globalPeriod,
}: ProductSalesCardProps) {
  const [period, setPeriod] = useState<Period>('month')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [viewType, setViewType] = useState<'type' | 'category'>('category')

  useEffect(() => {
    const syncPeriod = () => {
      if (globalPeriod && globalPeriod !== 'custom') {
        setPeriod(globalPeriod)
        setDateRange(undefined)
      }
    }
    syncPeriod()
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
          period:
            period === 'custom'
              ? 'month'
              : (period as 'day' | 'week' | 'month' | 'year'),
        }

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateRange(undefined)
    }
  }

  const { data: topProducts, isLoading } = useTopProductsQuery(queryParams)

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
    if (Array.isArray(topProducts)) {
      return topProducts
        .map((item) => ({
          name: item.name,
          value: item.total_sales,
          fill: generateRandomColor(),
        }))
        .slice(0, 6)
    }
    return []
  }, [topProducts])

  return (
    <Card
      className={cn(
        'bg-card border-border flex max-h-[500px] flex-col',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <h3 className='text-md font-semibold tracking-wide uppercase'>
          PENJUALAN PRODUK {getPeriodLabel()}
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

      <div className='flex w-full items-center justify-end px-6'>
        <Tabs
          defaultValue='type'
          onValueChange={(value) => setViewType(value as 'type' | 'category')}
          value={viewType}
        >
          <TabsList>
            <TabsTrigger value='type'>Produk</TabsTrigger>
            <TabsTrigger value='category'>Kategori</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
                    className='h-3 w-8 rounded-sm'
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
          <div className='bg-primary/50 h-2 w-2 rounded-full' />
          <div className='bg-muted h-2 w-2 rounded-full' />
        </div>
      </CardContent>
    </Card>
  )
}
