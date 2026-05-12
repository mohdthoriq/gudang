import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MenusDialogs } from './components/menus-dialogs'
import { MenusProvider, useMenus } from './components/menus-provider'
import { MenusTable } from './components/menus-table'

const route = getRouteApi('/_authenticated/admin/menus/')

function MenusContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useMenus()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengaturan Menu
            </h2>
            <p className='text-muted-foreground'>
              Kelola Menu Aplikasi Manajerku.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => setOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Menu
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <MenusTable search={search} navigate={navigate} />
        <MenusDialogs />
      </CardContent>
    </Card>
  )
}

function Menus() {
  const search = route.useSearch() as Record<string, string>

  // Extract pagination parameters from URL search
  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined

  return (
    <MenusProvider paginationParams={{ page, limit, name }}>
      <MenusContent />
    </MenusProvider>
  )
}

export default Menus
