import { forwardRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { SummaryCards } from '../summary-cards'
import { AdminDashboardChart } from '../admin-dashboard-chart'
import { SubscriptionOverview } from '../subscription-overview'
import type { AdminDashboardData, AdminDashboardChartData, AdminDashboardPeriod } from '../../types'

interface AdminDashboardPrintProps {
  data: AdminDashboardData | undefined
  chartData: AdminDashboardChartData[]
  isLoading: boolean
  period: AdminDashboardPeriod
  year: number
  month?: number
  className?: string
}

export const AdminDashboardPrint = forwardRef<HTMLDivElement, AdminDashboardPrintProps>(
  ({ data, chartData, isLoading, period, year, month, className }, ref) => {
    const { auth } = useAuthStore()
    const user = auth.user

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-y-10 bg-white p-10 print:flex',
          className
        )}
      >
        <style type='text/css' media='print'>
          {`
              @page {
                size: portrait;
                margin: 10mm;
              }
            `}
        </style>
        
        {/* Header Print */}
        <div className='mb-6 flex flex-col items-center justify-center space-y-3 border-b-2 border-slate-900 pb-10 text-center'>
          <div className='flex flex-col items-center space-y-1'>
            <h2 className='text-3xl font-black tracking-widest text-slate-900 uppercase'>
              MANAJERKU ADMIN
            </h2>
            <div className='h-1 w-24 bg-slate-900' />
            <h1 className='mt-4 text-4xl font-bold tracking-tight text-slate-800'>
              Laporan Ikhtisar Admin
            </h1>
          </div>
        </div>

        {/* Konten Laporan */}
        <div className='flex flex-col gap-y-12'>
          <div className='space-y-4'>
            <h4 className='text-lg font-bold text-slate-700 uppercase'>
              1. Ringkasan Statistik
            </h4>
            <SummaryCards summary={data?.summary} isLoading={isLoading} />
          </div>

          <div className='space-y-4'>
            <h4 className='text-lg font-bold text-slate-700 uppercase'>
              2. Grafik Pertumbuhan
            </h4>
            <div className='h-[400px]'>
              <AdminDashboardChart
                chartData={chartData}
                isLoading={isLoading}
                period={period}
                year={year}
                month={month}
                onFilterChange={() => {}}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='text-lg font-bold text-slate-700 uppercase'>
              3. Distribusi Paket Langganan
            </h4>
            <div className='h-[400px]'>
              <SubscriptionOverview
                subscriptionByPlan={data?.subscription_by_plan}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Footer Print */}
        <div className='mt-auto pt-10 text-center text-xs text-slate-400'>
          Dicetak oleh {user?.user?.full_name || user?.user?.email} pada {new Date().toLocaleString('id-ID')} - Manajerku Admin
        </div>
      </div>
    )
  }
)

AdminDashboardPrint.displayName = 'AdminDashboardPrint'
