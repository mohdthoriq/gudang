import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { UsersTable } from './users-table'

export function UsersFallback({
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
                Pengaturan Pengguna
              </h2>
              <p className='text-muted-foreground'>
                Kelola Pengguna di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button variant={'link'} onClick={() => history.go(-1)}>
                Kembali
              </Button>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Akun
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <UsersTable search={search} navigate={navigate} />
        </CardContent>
      </Card>
      <UpgradePlanCard feature='Pengguna' />
    </div>
  )
}
