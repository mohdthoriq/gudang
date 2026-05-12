import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { ContactsTable } from './contacts-table'

export function ContactsFallback({
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
                Pengaturan Kontak
              </h2>
              <p className='text-muted-foreground'>
                Kelola Kontak di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button variant={'link'} onClick={() => history.go(-1)}>
                Kembali
              </Button>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Kontak
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ContactsTable search={search} navigate={navigate} />
        </CardContent>
      </Card>
      <UpgradePlanCard feature='Kontak' />
    </div>
  )
}
