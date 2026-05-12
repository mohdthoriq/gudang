import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { TagsTable } from './tags-table'

export function TagsFallback({
  search,
  navigate,
}: {
  search: Record<string, unknown>
  navigate: NavigateFn
}) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none opacity-100 blur-[2px]'>
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
            <div>
              <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
                <Button variant={'link'} onClick={() => history.go(-1)}>
                  Kembali
                </Button>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Tambah Tag
                </Button>
              </div>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <TagsTable search={search} navigate={navigate} />
          </div>
        </CardContent>
      </Card>
      <UpgradePlanCard feature='Tag' />
    </div>
  )
}
