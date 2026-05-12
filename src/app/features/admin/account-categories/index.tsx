import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AccountCategoriesDialogs } from './components/account-categories-dialogs'
import {
  AccountCategoriesProvider,
  useAccountCategories,
} from './components/account-categories-provider'
import { AccountCategoriesTable } from './components/account-categories-table'

const route = getRouteApi('/_authenticated/admin/account-categories/')

function AccountCategoriesContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useAccountCategories()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengaturan Kategori Akun
            </h2>
            <p className='text-muted-foreground'>
              Kelola Kategori Akun di Perusahaan Anda.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => setOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Kategori Akun
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <AccountCategoriesTable search={search} navigate={navigate} />
        <AccountCategoriesDialogs />
      </CardContent>
    </Card>
  )
}

function AccountCategories() {
  const search = route.useSearch() as Record<string, string>

  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined

  return (
    <AccountCategoriesProvider paginationParams={{ page, limit, name }}>
      <AccountCategoriesContent />
    </AccountCategoriesProvider>
  )
}

export default AccountCategories
