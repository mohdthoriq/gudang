import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { Overdue } from './overdue'
import { PaidRatioCard } from './paid-ratio-card'
import { PaymentChartCard } from './payment-chart-card'
import { PaymentsReceived } from './payments-sent'
import { ProductPurchasesCard } from './product-purchases-card'
import { SalesChartCard } from './purchases-chart-card'
import { TotalPurchases } from './total-purchases'
import { VendorPurchasesCard } from './vendor-purchases-card'
import { WaitingPayments } from './waiting-payments'

export function PurchasesOverviewFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none flex w-full flex-col items-center justify-between space-y-8 opacity-100 blur-[4px]'>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-4xl font-medium'>Overview Pembelian</h1>
          <Button variant='outline' className='gap-2 shadow-sm'>
            <Printer className='h-4 w-4' />
            {'Cetak'}
          </Button>
        </div>
        <div className='flex w-full items-center justify-end'>
          <Tabs defaultValue='month'>
            <TabsList className='h-10 w-[200px]'>
              <TabsTrigger value='month'>Bulan</TabsTrigger>
              <TabsTrigger value='year'>Tahun</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='grid w-full grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2'>
            <TotalPurchases />
            <PaymentsReceived />
            <WaitingPayments />
            <Overdue />
            <SalesChartCard className='col-span-1 md:col-span-2' />
            <PaymentChartCard className='col-span-1 md:col-span-2' />
          </div>
          <div className='flex flex-col gap-4'>
            <PaidRatioCard className='h-auto' />
            <ProductPurchasesCard className='h-auto' />
            <VendorPurchasesCard className='h-auto' />
          </div>
        </div>
      </div>
      <UpgradePlanCard feature='Ringkasan Pembelian' />
    </div>
  )
}
