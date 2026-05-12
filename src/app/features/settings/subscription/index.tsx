import { useNavigate } from '@tanstack/react-router'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { SubscriptionContent } from './components/subscription-content'
import { SubscriptionFallback } from './components/subscription-fallback'

export function SubscriptionPage() {
  const navigate = useNavigate()
  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_BILLING}
      fallback={<SubscriptionFallback />}
    >
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
              <Button
                variant={'link'}
                onClick={() =>
                  navigate({
                    to: '/settings',
                    search: { tab: 'company' },
                  })
                }
              >
                Kembali
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <SubscriptionContent />
      </Card>
    </PermissionGuard>
  )
}
