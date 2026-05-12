import { forwardRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { CustomerSalesCard } from '../customer-sales-card'
import { Overdue } from '../overdue'
import { PaidRatioCard } from '../paid-ratio-card'
import { PaymentChartCard } from '../payment-chart-card'
import { PaymentsReceived } from '../payments-received'
import { ProductSalesCard } from '../product-sales-card'
import { SalesChartCard } from '../sales-chart-card'
import { TotalSales } from '../total-sales'
import { WaitingPayments } from '../waiting-payments'

export const SalesOverviewPrint = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  const company = useAuthStore((state) => state.auth.user?.company)
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-y-10 bg-white p-10', className)}
    >
      <style type='text/css' media='print'>
        {`
                @page {
                  size: portrait;
                  margin: 0mm;
                }
              `}
      </style>
      <div className='mb-6 flex flex-col items-center justify-center space-y-3 border-b-2 border-slate-900 pb-10 text-center'>
        {company?.logo_url && (
          <img
            src={company.logo_url}
            alt={company.name}
            className='mb-2 h-20 w-auto object-contain'
          />
        )}
        <div className='flex flex-col items-center space-y-1'>
          <h2 className='text-3xl font-black tracking-widest text-slate-900 uppercase'>
            {company?.name || 'MANAJERKU'}
          </h2>
          <div className='h-1 w-24 bg-slate-900' />
          <h1 className='mt-4 text-4xl font-bold tracking-tight text-slate-800'>
            Ringkasan Penjualan
          </h1>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-x-10 gap-y-10'>
        <TotalSales />
        <PaymentsReceived />
        <WaitingPayments />
        <Overdue />
      </div>

      <div className='flex flex-col gap-y-10'>
        <SalesChartCard className='col-span-1' />
        <PaymentChartCard className='col-span-1' />
      </div>

      <div className='flex flex-col gap-y-10'>
        <PaidRatioCard className='h-auto' />
        <ProductSalesCard className='h-auto' />
        <CustomerSalesCard className='h-auto' />
      </div>
    </div>
  )
})
