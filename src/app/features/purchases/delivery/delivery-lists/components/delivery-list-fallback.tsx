import { getRouteApi } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { DeliveryListsTable } from './delivery-list-table'

const route = getRouteApi('/_authenticated/purchases/delivery/')

export function DeliveryListsFallback() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  return (
    <Card className='relative'>
      <CardHeader className='pointer-events-none opacity-100 blur-[2px]'>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengiriman Pembelian
            </h2>
            <p className='text-muted-foreground'>
              Kelola pengiriman pembelian.
            </p>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent className='pointer-events-none opacity-100 blur-[2px]'>
        <DeliveryListsTable search={search} navigate={navigate} />
      </CardContent>
      <UpgradePlanCard feature='List Pengiriman Pembelian' />
    </Card>
  )
}
