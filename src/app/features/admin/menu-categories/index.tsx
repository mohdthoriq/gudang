import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MenuCategoriesDialogs } from './components/menu-categories-dialogs'
import { MenuCategoriesProvider, useMenuCategories } from './components/menu-categories-provider'
import { MenuCategoriesTable } from './components/menu-categories-table'

const route = getRouteApi('/_authenticated/admin/menu-categories/')

function MenuCategoriesContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useMenuCategories()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Kategori Menu
            </h2>
            <p className='text-muted-foreground'>
              Kelola Kategori Menu Aplikasi Manajerku.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => setOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Kategori
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <MenuCategoriesTable search={search} navigate={navigate} />
        <MenuCategoriesDialogs />
      </CardContent>
    </Card>
  )
}

function MenuCategories() {
  const search = route.useSearch() as Record<string, string>

  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined

  return (
    <MenuCategoriesProvider paginationParams={{ page, limit, name }}>
      <MenuCategoriesContent />
    </MenuCategoriesProvider>
  )
}

export default MenuCategories
