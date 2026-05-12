import { forwardRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { BillsOverview } from '../bills-overview'
import { CashOverview } from '../cash-overview'
import { ExpenseOverview } from '../expense-overview'
import { SalesDashboardOverview } from '../sales-overview'

export const DashboardPrint = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className }, ref) => {
  const { auth } = useAuthStore()
  const company = auth.user?.company

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
              margin: 0mm;
            }
          `}
      </style>
      {/* Header Print - Cop Surat */}
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
            Dashboard
          </h1>
        </div>
      </div>

      {/* Konten Laporan */}
      <div className='flex flex-col gap-y-16'>
        <div className='space-y-4'>
          <h4 className='text-lg font-bold text-slate-700 uppercase'>
            1. Ringkasan Kas & Bank
          </h4>
          <CashOverview />
        </div>

        <div className='space-y-4'>
          <h4 className='text-lg font-bold text-slate-700 uppercase'>
            2. Tagihan Mendatang
          </h4>
          <BillsOverview />
        </div>

        <div className='space-y-4'>
          <h4 className='text-lg font-bold text-slate-700 uppercase'>
            3. Performa Penjualan
          </h4>
          <SalesDashboardOverview />
        </div>

        <div className='space-y-4'>
          <h4 className='text-lg font-bold text-slate-700 uppercase'>
            4. Ringkasan Pengeluaran
          </h4>
          <ExpenseOverview />
        </div>
      </div>

      {/* Footer Print */}
      <div className='mt-auto pt-10 text-center text-xs text-slate-400'>
        Dicetak pada {new Date().toLocaleString('id-ID')} - Manajerku Web
      </div>
    </div>
  )
})

DashboardPrint.displayName = 'DashboardPrint'
