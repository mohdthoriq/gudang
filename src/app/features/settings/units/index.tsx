import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { UnitsDialogs } from './components/units-dialogs'
import { UnitsFallback } from './components/units-fallback'
import { UnitsProvider, useUnits } from './components/units-provider'
import { UnitsTable } from './components/units-table'
import { type UnitsQueryParams } from './hooks/use-units-query'

const route = getRouteApi('/_authenticated/settings/units/')

function UnitsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useUnits()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_UNIT}
      fallback={<UnitsFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Satuan
              </h2>
              <p className='text-muted-foreground'>
                Kelola Satuan di Perusahaan Anda.
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
                Tambah Satuan
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <UnitsTable search={search} navigate={navigate} />
          <UnitsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Units() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: UnitsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <UnitsProvider paginationParams={queryParams}>
      <UnitsContent />
    </UnitsProvider>
  )
}

export default Units
