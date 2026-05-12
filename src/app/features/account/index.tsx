import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { AccountsDialogs } from './components/account-dialogs'
import { AccountFallback } from './components/account-fallback'
import { AccountsProvider, useAccounts } from './components/account-provider'
import { AccountsTable } from './components/account-table'
import type { AccountQueryParams } from './hooks/use-account-query'

const route = getRouteApi('/_authenticated/account/')

function AccountContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useAccounts()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.ACCOUNT}
      fallback={<AccountFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Akun
              </h2>
              <p className='text-muted-foreground'>
                Kelola Akun di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button onClick={() => setOpen('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Akun
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <AccountsTable search={search} navigate={navigate} />
          <AccountsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Account() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: AccountQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
    category_id: search?.category_id ? search.category_id : undefined,
    is_active: search?.is_active ? !!search.is_active : undefined,
    transaction_types: search?.transaction_types
      ? search.transaction_types.split(',')
      : undefined,
    order: search?.order ? (search.order as 'asc' | 'desc') : undefined,
  }

  return (
    <AccountsProvider paginationParams={queryParams}>
      <AccountContent />
    </AccountsProvider>
  )
}

export default Account
