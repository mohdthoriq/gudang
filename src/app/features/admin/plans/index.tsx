import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PlansProvider } from './components/plans-provider'
import { PlansTable } from './components/plans-table'

// We will update this to '/_authenticated/admin/plans/' after renaming the route
const route = getRouteApi('/_authenticated/admin/plans/')

function PlansContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengaturan Plan
            </h2>
            <p className='text-muted-foreground'>
              Kelola Plan Aplikasi Manajerku.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => navigate({ to: '/admin/plans/add' })}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Plan
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <PlansTable search={search} navigate={navigate} />
      </CardContent>
    </Card>
  )
}

function Plans() {
  const search = route.useSearch() as Record<string, string>

  // Extract pagination parameters from URL search
  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined

  return (
    <PlansProvider paginationParams={{ page, limit, name }}>
      <PlansContent />
    </PlansProvider>
  )
}

export default Plans