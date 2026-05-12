import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionsDialogs } from './components/permissions-dialogs'
import {
  PermissionsProvider,
  usePermissions,
} from './components/permissions-provider'
import { PermissionsTable } from './components/permissions-table'

const route = getRouteApi('/_authenticated/admin/permissions/')

function PermissionsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = usePermissions()

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pengaturan Permission
            </h2>
            <p className='text-muted-foreground'>
              Kelola Permission Aplikasi Manajerku.
            </p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'link'} onClick={() => history.go(-1)}>
              Kembali
            </Button>
            <Button onClick={() => setOpen('add')}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Permission
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent>
        <PermissionsTable search={search} navigate={navigate} />
        <PermissionsDialogs />
      </CardContent>
    </Card>
  )
}

function Permissions() {
  const search = route.useSearch() as Record<string, string>

  // Extract pagination parameters from URL search
  const page = search?.page ? parseInt(search.page) : undefined
  const limit = search?.limit ? parseInt(search.limit) : undefined
  const name = search?.name ? search.name : undefined

  return (
    <PermissionsProvider paginationParams={{ page, limit, name }}>
      <PermissionsContent />
    </PermissionsProvider>
  )
}

export default Permissions
