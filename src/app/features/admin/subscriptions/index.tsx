import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SubscriptionsDialogs } from './components/subscriptions-dialogs'
import {
  SubscriptionsProvider,
  useSubscriptions,
} from './components/subscriptions-provider'
import { SubscriptionsTable } from './components/subscriptions-table'

const route = getRouteApi('/_authenticated/admin/subscriptions/')

function SubscriptionsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useSubscriptions()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengaturan Subscription
            </h2>
            <p className='text-muted-foreground'>
              Kelola Subscription Aplikasi Manajerku.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => setOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Subscription
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <SubscriptionsTable search={search} navigate={navigate} />
        <SubscriptionsDialogs />
      </CardContent>
    </Card>
  )
}

function Subscriptions() {
  const search = route.useSearch() as Record<string, string>

  // Extract pagination parameters from URL search
  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined
  const plan_id = search?.plan_id ? search.plan_id : undefined
  const plan_name = search?.plan_name ? search.plan_name : undefined

  return (
    <SubscriptionsProvider
      paginationParams={{ page, limit, name, plan_id, plan_name }}
    >
      <SubscriptionsContent />
    </SubscriptionsProvider>
  )
}

export default Subscriptions
