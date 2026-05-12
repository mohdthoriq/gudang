import { ArrowLeft, Plus, Printer } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { ExpensesListsTable } from './expenses-list-table'

export function ExpensesListFallback({
  search,
  navigate,
}: {
  search: Record<string, unknown>
  navigate: NavigateFn
}) {
  return (
    <Card className='relative'>
      <CardHeader className='pointer-events-none opacity-100 blur-[2px]'>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>Biaya</h2>
            <p className='text-muted-foreground'>Kelola Biaya.</p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'outline'} onClick={() => history.go(-1)}>
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
            <Button>
              <Plus className='h-4 w-4' />
              Tambah Biaya
            </Button>
            <Button variant={'outline'}>
              <Printer className='h-4 w-4' />
              Cetak
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent className='pointer-events-none opacity-100 blur-[2px]'>
        <ExpensesListsTable search={search} navigate={navigate} />
      </CardContent>
      <UpgradePlanCard feature='List Biaya' />
    </Card>
  )
}
