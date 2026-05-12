import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { usePaidRatioQuery } from '../hooks/use-purchases-overview-query'
import type { Period } from '../types/purchases-overview'
import { CardAction } from './card-action'

interface PaidRatioCardProps {
  className?: string
  globalPeriod?: Period
}

const NEEDLE_BASE_COLOR = '#374151'

const RADIAN = Math.PI / 180
const data = [
  { name: 'E', value: 20, color: '#e4e4e7' }, // zinc-200
  { name: 'D', value: 20, color: '#bae6fd' }, // sky-200
  { name: 'C', value: 20, color: '#60a5fa' }, // blue-400
  { name: 'B', value: 20, color: '#fde047' }, // yellow-300
  { name: 'A', value: 20, color: '#f87171' }, // red-400
]

const cx = 150
const cy = 100
const iR = 60
const oR = 100

const Needle = ({
  value,
  cx,
  cy,
  iR,
  oR,
  color,
}: {
  value: number
  cx: number
  cy: number
  iR: number
  oR: number
  color: string
}) => {
  const ang = 180.0 * (1 - value / 100)
  const length = (iR + 2 * oR) / 3
  const sin = Math.sin(-RADIAN * ang)
  const cos = Math.cos(-RADIAN * ang)
  const r = 5
  const x0 = cx + 5
  const y0 = cy + 5
  const xba = x0 + r * sin
  const yba = y0 - r * cos
  const xbb = x0 - r * sin
  const ybb = y0 + r * cos
  const xp = x0 + length * cos
  const yp = y0 + length * sin

  return (
    <>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke='none' />
      <path
        d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
        stroke='none'
        fill={color}
      />
    </>
  )
}

export function PaidRatioCard({ className, globalPeriod }: PaidRatioCardProps) {
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

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setDateRange(undefined)
    }
  }
  const { data: paidRatioData, isLoading } = usePaidRatioQuery(queryParams)

  const safePercentage = paidRatioData?.percentage ?? 0
  const description =
    paidRatioData?.description ||
    'Invoices paid vs total Invoices for this month'

  return (
    <Card className={cn('bg-card border-border max-h-[320px]', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='text-md font-semibold tracking-wide uppercase'>
          Rasio Lunas
        </h3>
        <CardAction
          period={period}
          dateRange={dateRange}
          setPeriod={setPeriod}
          setDateRange={setDateRange}
          onChange={handlePeriodChange}
        />
      </CardHeader>
      <CardContent className='flex flex-col items-center justify-center space-y-4'>
        {isLoading ? (
          <div className='flex h-[180px] items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          </div>
        ) : (
          <>
            <div className='relative h-[120px] w-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    dataKey='value'
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    fill='#8884d8'
                    stroke='none'
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <g>
                    <Needle
                      cx={cx}
                      cy={cy}
                      iR={iR}
                      oR={oR}
                      value={safePercentage}
                      color={NEEDLE_BASE_COLOR}
                    />
                  </g>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className='space-y-1 text-center'>
              <div className='text-3xl font-bold'>
                {formatNumber(safePercentage)}%
              </div>
              <p className='text-muted-foreground text-xs'>{description}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
