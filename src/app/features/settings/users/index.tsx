import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { UsersDialogs } from './components/users-dialogs'
import { UsersFallback } from './components/users-fallback'
import { UsersProvider, useUsers } from './components/users-provider'
import { UsersTable } from './components/users-table'
import type { UsersQueryParams } from './hooks/use-users-query'

const route = getRouteApi('/_authenticated/settings/users/')

function UsersContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useUsers()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_USER}
      fallback={<UsersFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Pengguna
              </h2>
              <p className='text-muted-foreground'>
                Kelola Pengguna di Perusahaan Anda.
              </p>
            </div>
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
              <Button onClick={() => setOpen('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Akun
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <UsersTable search={search} navigate={navigate} />
          <UsersDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Users() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: UsersQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <UsersProvider paginationParams={queryParams}>
      <UsersContent />
    </UsersProvider>
  )
}

export default Users
