import { useNavigate } from '@tanstack/react-router'
import type { CashBankOverview } from '@/types'
import { Settings2 } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { cn, formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AccountChartCardProps {
  data: CashBankOverview
}

export function AccountChartCard({ data }: AccountChartCardProps) {
  const navigate = useNavigate()

  const formatYAxis = (value: number) => {
    return formatNumber(value)
  }

  const formatTooltipValue = (value: number) => {
    return formatNumber(value)
  }

  const handleNavigate = () => {
    navigate({
      to: '/cash-bank/$accountName',
      params: { accountName: data.name },
      state: {
        accountId: data.id,
        accountName: data.name,
      } as unknown as Record<string, unknown>,
    })
  }

  return (
    <Card
      className='cursor-pointer hover:border-none hover:shadow-lg hover:shadow-black/5'
      onClick={() => handleNavigate()}
    >
      <div className='flex items-start justify-between border-b px-5'>
        <div className='mb-4 py-2 text-left'>
          <h3 className='text-lg font-bold'>{data.name}</h3>
          <p className='text-muted-foreground font-mono text-sm'>{data.code}</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='flex gap-2 border-none px-4 py-5'
          onClick={(e) => {
            e.stopPropagation()
            handleNavigate()
          }}
        >
          <Settings2 className='h-4 w-4' />
          Atur Akun
        </Button>
      </div>
      <CardContent>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
          <div className='flex flex-col justify-center gap-6 md:col-span-1'>
            {/* <div className='flex flex-col'>
              <span
                className={cn(
                  'text-xl font-semibold',
                  data.statement_balance < 0 && 'text-red-500'
                )}
              >
                {formatNumber(data.statement_balance)}
              </span>
              <span className='text-muted-foreground mt-1 text-sm'>
                Saldo di bank
              </span>
            </div> */}
            <div className='flex flex-col'>
              <span
                className={cn(
                  'text-xl font-semibold',
                  data.closing_balance < 0 && 'text-red-400'
                )}
              >
                {formatNumber(data.closing_balance)}
              </span>
              <span className='text-muted-foreground mt-1 text-sm'>
                Saldo di manajerku
              </span>
            </div>
          </div>
          <div className='h-[250px] w-full md:col-span-3'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={data.graphic}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey='date'
                  tickFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString('id-ID', {
                        month: 'short',
                      })
                    } catch {
                      return value
                    }
                  }}
                  stroke='#94a3b8'
                  fontSize={12}
                  height={40}
                  tickLine={false}
                  interval={data.graphic.length > 10 ? 0 : 'preserveStartEnd'}
                  axisLine={false}
                  tickMargin={10}
                  angle={data.graphic.length > 10 ? -45 : 0}
                  textAnchor={data.graphic.length > 10 ? 'end' : 'middle'}
                />
                <YAxis
                  fontSize={12}
                  tickMargin={20}
                  width={80}
                  tickFormatter={formatYAxis}
                  tickCount={7}
                  stroke='#71717a'
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: '#fafafa' }}
                  cursor={{
                    stroke: '#71717a',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }}
                  labelFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    } catch {
                      return value
                    }
                  }}
                  formatter={(value: number | undefined) => [
                    formatTooltipValue(value || 0),
                    'Saldo',
                  ]}
                />
                <Area
                  type='monotone'
                  dataKey='balance'
                  stroke='#fb7185'
                  fill='#fb7185'
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
