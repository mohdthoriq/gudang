import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDashboardCardAction } from './admin-dashboard-card-action'
import type { AdminDashboardChartData, AdminDashboardPeriod } from '../types'

interface AdminDashboardChartProps {
  chartData: AdminDashboardChartData[] | undefined
  isLoading: boolean
  period: AdminDashboardPeriod
  year: number
  month?: number
  onFilterChange: (updates: {
    period?: AdminDashboardPeriod
    year?: number
    month?: number
  }) => void
}

export function AdminDashboardChart({
  chartData,
  isLoading,
  period,
  year,
  month,
  onFilterChange,
}: AdminDashboardChartProps) {
  if (isLoading) {
    return (
      <Card className='col-span-1 lg:col-span-3'>
        <CardHeader>
          <CardTitle>Pertumbuhan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[350px] w-full animate-pulse rounded bg-muted' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-1 lg:col-span-3'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base font-semibold uppercase'>
          Pertumbuhan
        </CardTitle>
        <AdminDashboardCardAction
          period={period}
          year={year}
          month={month}
          onChange={onFilterChange}
        />
      </CardHeader>
      <CardContent className='pl-2'>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='label'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            />
            <Legend />
            <Bar
              name='Perusahaan Baru'
              dataKey='new_companies'
              fill='#2563eb'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name='Pengguna Baru'
              dataKey='new_users'
              fill='#10b981'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name='Langganan Baru'
              dataKey='new_subscriptions'
              fill='#f59e0b'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
