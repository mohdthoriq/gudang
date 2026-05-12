import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { TagsDialogs } from './components/tags-dialogs'
import { TagsFallback } from './components/tags-fallback'
import { TagsProvider, useTags } from './components/tags-provider'
import { TagsTable } from './components/tags-table'
import { type TagsQueryParams } from './hooks/use-tags-query'

const route = getRouteApi('/_authenticated/settings/tags/')

function TagsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useTags()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS_TAG}
      fallback={<TagsFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Tag
              </h2>
              <p className='text-muted-foreground'>
                Kelola Tag di Perusahaan Anda.
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
                Tambah Tag
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <TagsTable search={search} navigate={navigate} />
          <TagsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Tags() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: TagsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: (search.search as string) || undefined,
  }

  return (
    <TagsProvider paginationParams={queryParams}>
      <TagsContent />
    </TagsProvider>
  )
}

export default Tags
