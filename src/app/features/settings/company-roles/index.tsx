import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { CompanyRolesFallback } from './components/company-roles-fallback'
import { CompanyRolesProvider } from './components/company-roles-provider'
import { CompanyRolesTable } from './components/company-roles-table'
import { type RoleSettingsQueryParams } from './hooks/use-company-roles-query'

const route = getRouteApi('/_authenticated/settings/company-roles/')

function CompanyRolesContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_COMPANY_ROLE}
      fallback={<CompanyRolesFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Peran
              </h2>
              <p className='text-muted-foreground'>
                Kelola Hak Akses Pengguna di Perusahaan Anda.
              </p>
            </div>
            <div>
              <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
                <Button
                  variant={'link'}
                  onClick={() =>
                    navigate({
                      to: '/settings',
                      search: { tab: 'user_account' },
                    })
                  }
                >
                  Kembali
                </Button>
                <Button
                  onClick={() =>
                    navigate({ to: '/settings/company-roles/add' })
                  }
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Tambah Peran
                </Button>
              </div>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <CompanyRolesTable search={search} navigate={navigate} />
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

export function CompanyRoles() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: RoleSettingsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <CompanyRolesProvider paginationParams={queryParams}>
      <CompanyRolesContent />
    </CompanyRolesProvider>
  )
}

export default CompanyRoles
