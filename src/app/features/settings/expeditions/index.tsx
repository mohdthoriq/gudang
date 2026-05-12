import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { ExpeditionsDialogs } from './components/expeditions-dialogs'
import { ExpeditionsFallback } from './components/expeditions-fallback'
import { ExpeditionsProvider, useExpeditions } from './components/expeditions-provider'
import { ExpeditionsTable } from './components/expeditions-table'
import { type ExpeditionsQueryParams } from './hooks/use-expeditions-query'

const route = getRouteApi('/_authenticated/settings/expeditions/')

function ExpeditionsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useExpeditions()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS}
      fallback={<ExpeditionsFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Ekspedisi
              </h2>
              <p className='text-muted-foreground'>
                Kelola Ekspedisi di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button
                variant={'link'}
                onClick={() =>
                  navigate({
                    to: '/settings',
                    search: { tab: 'master_data' },
                  })
                }
              >
                Kembali
              </Button>
              <Button onClick={() => setOpen('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Ekspedisi
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ExpeditionsTable search={search} navigate={navigate} />
          <ExpeditionsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Expeditions() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: ExpeditionsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
    is_active: search?.is_active ? search.is_active : undefined,
  }

  return (
    <ExpeditionsProvider paginationParams={queryParams}>
      <ExpeditionsContent />
    </ExpeditionsProvider>
  )
}

export default Expeditions
