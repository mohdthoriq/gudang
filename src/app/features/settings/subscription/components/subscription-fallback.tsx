import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { SubscriptionContent } from './subscription-content'

export function SubscriptionFallback() {
  return (
    <div className='relative'>
      <div className='pointer-events-none w-full flex-1 space-y-3 overflow-hidden opacity-100 blur-[2px]'>
        <Card>
          <CardHeader>
            <div className='flex justify-between'>
              <div className='mb-2 grid'>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Langganan Saya
                </h2>
                <p className='text-muted-foreground'>
                  Kelola langganan dan paket Anda.
                </p>
              </div>
              <div>
                <Button variant={'link'} disabled>
                  Kembali
                </Button>
              </div>
            </div>
            <hr />
          </CardHeader>
          <SubscriptionContent />
        </Card>
      </div>
      <UpgradePlanCard feature='Subscription' />
    </div>
  )
}
