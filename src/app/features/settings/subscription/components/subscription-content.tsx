import { AlertCircle } from 'lucide-react'
import type { Subscription } from '@/types'
import { CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { usePlansQuery } from '../hooks/use-plans-query'
import { useSubscription } from '../hooks/use-subscription'
// import { PlanDetailsCard } from './plan-details-card'
import { PricingSection } from './pricing-section'
import { SubscriptionInfoCard } from './subscription-info-card'

export function SubscriptionContent() {
  const { subscription, plan: subscriptionPlan, company, user } = useSubscription()
  const { data: plans = [], isLoading: isPlansLoading } = usePlansQuery()

  // Cari paket default atau gratis jika tidak ada langganan aktif
  const defaultPlan = plans.find(
    (p) => p.code === 'default-plan' || p.monthly_price === 0
  )

  // Tentukan data langganan yang akan ditampilkan
  // Jika tidak ada record subscription, gunakan paket default sebagai "virtual subscription"
  const activeSubscription =
    subscription ||
    (defaultPlan
      ? ({
          id: 'free-default-subscription',
          plan_name: defaultPlan.name,
          status: 'active',
          start_date: company?.created_at || new Date(),
          end_date: null,
          plan: defaultPlan,
        } as unknown as Subscription)
      : undefined)

  const activePlan = subscriptionPlan || defaultPlan

  if (isPlansLoading) {
    return (
      <CardContent className='flex justify-center py-12'>
        <div className='flex items-center gap-2'>
          <span className='loading loading-spinner loading-md'></span>
          <p className='text-muted-foreground text-sm'>Memuat data langganan...</p>
        </div>
      </CardContent>
    )
  }

  if (!activeSubscription) {
    return (
      <CardContent>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
            <AlertCircle className='text-muted-foreground h-8 w-8' />
          </div>
          <h3 className='mb-2 text-lg font-semibold'>Belum Ada Langganan</h3>
          <p className='text-muted-foreground max-w-sm text-sm'>
            Anda belum memiliki paket langganan aktif. Silakan pilih paket di
            bawah ini.
          </p>
        </div>

        <Separator className='my-8' />

        <PricingSection
          currentPlanName={undefined}
          plans={plans}
          isLoading={isPlansLoading}
        />
      </CardContent>
    )
  }

  return (
    <CardContent className='space-y-8'>
      <div className='space-y-6'>
        <SubscriptionInfoCard
          subscription={activeSubscription}
          companyName={company?.name}
          userName={user?.full_name}
        />
        {/* Detail paket tambahan bisa ditampilkan di sini jika diperlukan */}
      </div>

      <Separator />

      <PricingSection
        currentPlanName={activePlan?.name || activeSubscription?.plan_name}
        plans={plans}
        isLoading={isPlansLoading}
      />
    </CardContent>
  )
}
