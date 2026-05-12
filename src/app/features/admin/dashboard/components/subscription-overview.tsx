import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SubscriptionByPlan } from '../types'

interface SubscriptionOverviewProps {
  subscriptionByPlan: SubscriptionByPlan[] | undefined
  isLoading: boolean
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function SubscriptionOverview({ 
  subscriptionByPlan, 
  isLoading,
}: SubscriptionOverviewProps) {
  const chartData = (subscriptionByPlan ?? []).map((item) => ({
    name: item.plan_name,
    value: item.company_count,
    percentage: item.percentage,
  }))

  if (isLoading) {
    return (
      <Card className='col-span-1 lg:col-span-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <CardTitle className='text-base font-semibold uppercase'>
            Distribusi Paket Langganan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[350px] w-full animate-pulse rounded bg-muted' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-1 lg:col-span-2 shadow-sm border-muted/40'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base font-semibold uppercase tracking-tight'>
          Distribusi Paket Langganan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex h-[350px] flex-col items-center justify-center'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey='value'
                stroke='none'
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className='focus:outline-none'
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(
                  value: number | string | (number | string)[] | undefined,
                  name: string | number | undefined,
                  item: { payload?: { percentage: number } }
                ) => {
                  if (value === undefined) return ['', '']
                  const val = Array.isArray(value) ? value[0] : value
                  const percentage = item.payload?.percentage ?? 0
                  return [`${val} Perusahaan (${percentage}%)`, name ?? '']
                }}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                }}
                itemStyle={{
                  color: 'var(--foreground)',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
                labelStyle={{
                  color: 'var(--muted-foreground)',
                  marginBottom: '4px',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className='mt-6 grid grid-cols-2 gap-x-6 gap-y-2'>
            {chartData.map((item, index) => (
              <div key={item.name} className='flex items-center space-x-2.5 group transition-all hover:translate-x-1'>
                <div
                  className='h-3 w-3 rounded-full shadow-sm'
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className='text-sm font-medium text-foreground/80 group-hover:text-foreground truncate max-w-[120px]'>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
