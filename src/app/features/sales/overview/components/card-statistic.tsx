import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Pie, PieChart } from 'recharts'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Direction, type Trend } from '../types/sales-overview'

interface CardStatisticProps {
  title: string
  value: number | undefined
  count?: number
  countLabel?: string
  trend?: Trend
  variant?: 'default' | 'graph'
  isLoading?: boolean
  cardAction?: ReactNode
}

const defaultFormatValue = (value: number | undefined) => {
  return new Intl.NumberFormat('id-ID').format(value ?? 0)
}

const getTrendColor = (direction?: Direction) => {
  switch (direction) {
    case Direction.Up:
      return 'text-green-500'
    case Direction.Down:
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const getTrendIcon = (direction?: Direction) => {
  switch (direction) {
    case Direction.Up:
      return <TrendingUp className='h-16 w-16' />
    case Direction.Down:
      return <TrendingDown className='h-16 w-16' />
    default:
      return null
  }
}

export function CardStatistic({
  title,
  value,
  count,
  countLabel = 'Tagihan',
  trend,
  variant = 'default',
  isLoading = false,
  cardAction,
}: CardStatisticProps) {
  const getVariantIcon = () => {
    if (variant === 'graph') {
      return (
        <div className='relative flex p-2'>
          <PieChart width={40} height={40}>
            <Pie
              data={[
                { value: Math.abs(trend?.percentage ?? 0), fill: '#f43f5e' }, // rose-500
                {
                  value: 100 - Math.abs(trend?.percentage ?? 0),
                  fill: '#fde047',
                }, // yellow-300
              ]}
              dataKey='value'
              outerRadius={18}
              stroke='#ffffff'
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            />
          </PieChart>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className='bg-card border-border'>
        <CardHeader className='pb-2'>
          <div className='bg-muted h-4 w-32 animate-pulse rounded' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='bg-muted h-8 w-40 animate-pulse rounded' />
          <div className='bg-muted h-3 w-24 animate-pulse rounded' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-card border-border hover:border-primary/50 flex max-h-[180px] min-h-[150px] flex-col gap-0 px-5 transition-colors'>
      <div className='flex items-start justify-between'>
        <h3 className='text-md font-semibold tracking-wide uppercase'>
          {title}
        </h3>
        {cardAction}
      </div>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col justify-start gap-1'>
          <div className='text-foreground text-lg font-bold'>
            {defaultFormatValue(value)}
          </div>
          {count !== undefined && (
            <div className='text-muted-foreground text-sm'>
              {count} {countLabel}
            </div>
          )}
        </div>
        <div
          className={cn(
            'mr-10 flex flex-col gap-1',
            variant === 'graph' ? 'items-center' : 'justify-start',
            variant === 'graph'
              ? 'text-red-500'
              : getTrendColor(trend?.direction)
          )}
        >
          {variant === 'graph'
            ? getVariantIcon()
            : getTrendIcon(trend?.direction)}
          <span className='text-xs font-medium'>
            {variant !== 'graph'
              ? trend?.direction === Direction.Down
                ? '-'
                : '+'
              : ''}
            {Math.abs(trend?.percentage ?? 0).toFixed(1)}%
          </span>
        </div>
      </div>
      {trend && variant !== 'graph' && (
        <span className='text-muted-foreground text-xs'>
          {trend.comparison_text}
        </span>
      )}

      {variant === 'graph' && trend && (
        <div className='text-muted-foreground text-xs'>
          {trend.comparison_text}
        </div>
      )}
    </Card>
  )
}
