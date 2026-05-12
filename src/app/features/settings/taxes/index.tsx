import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { TaxesDialogs } from './components/taxes-dialogs'
import { TaxesFallback } from './components/taxes-fallback'
import { useTaxes, TaxesProvider } from './components/taxes-provider'
import { TaxesTable } from './components/taxes-table'
import { type TaxesQueryParams } from './hooks/use-taxes-query'

const route = getRouteApi('/_authenticated/settings/taxes/')

function TaxesContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useTaxes()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_TAX}
      fallback={<TaxesFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Pajak
              </h2>
              <p className='text-muted-foreground'>
                Kelola Pajak di Perusahaan Anda.
              </p>
            </div>
            <div>
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
                  Tambah Pajak
                </Button>
              </div>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <TaxesTable search={search} navigate={navigate} />
            <TaxesDialogs />
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export function Taxes() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: TaxesQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <TaxesProvider paginationParams={queryParams}>
      <TaxesContent />
    </TaxesProvider>
  )
}

export default Taxes
