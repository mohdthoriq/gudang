import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { ContactsDialogs } from './components/contacts-dialogs'
import { ContactsFallback } from './components/contacts-fallback'
import { ContactsProvider, useContacts } from './components/contacts-provider'
import { ContactsTable } from './components/contacts-table'
import type { ContactQueryParams } from './hooks/use-contacts-query'

const route = getRouteApi('/_authenticated/contacts/')

function ContactsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useContacts()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.CONTACT}
      fallback={<ContactsFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Kontak
              </h2>
              <p className='text-muted-foreground'>
                Kelola Kontak di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button onClick={() => setOpen('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Kontak
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ContactsTable search={search} navigate={navigate} />
          <ContactsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Contacts() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: ContactQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
    type_id: search?.type_id ? search.type_id : undefined,
  }

  return (
    <ContactsProvider paginationParams={queryParams}>
      <ContactsContent />
    </ContactsProvider>
  )
}

export default Contacts
