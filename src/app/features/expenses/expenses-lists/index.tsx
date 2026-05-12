import { useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { ExpensesListFallback } from './components/expenses-list-fallback'
import { ExpensesListsProvider } from './components/expenses-list-provider'
import { ExpensesListsTable } from './components/expenses-list-table'
import { ExpenseListsTablePrint } from './components/print/expense-list-print'
import { type ExpenseListQueryParams } from './hooks/use-expenses-list-query'

const route = getRouteApi('/_authenticated/expenses/')

function ExpensesListsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const printRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onBeforePrint: async () => {
      setIsPrinting(true)
      return new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
    },
    onAfterPrint: () => {
      setIsPrinting(false)
    },
  })

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.EXPENSE}
      fallback={<ExpensesListFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>Biaya</h2>
              <p className='text-muted-foreground'>
                Kelola dan pantau seluruh pengeluaran operasional Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button onClick={() => navigate({ to: '/expenses/add' })}>
                <Plus className='h-4 w-4' />
                Tambah Biaya
              </Button>
              <Button variant={'outline'} onClick={handlePrint}>
                <Printer className='h-4 w-4' />
                {isPrinting ? 'Memproses...' : 'Cetak'}
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ExpensesListsTable search={search} navigate={navigate} />
        </CardContent>
      </Card>
      <div
        className={
          isPrinting ? 'absolute top-0 left-0 z-[-1] m-0 w-fit p-0' : 'hidden'
        }
      >
        <ExpenseListsTablePrint ref={printRef} />
      </div>
    </PermissionGuard>
  )
}

function ExpensesLists() {
  const search = route.useSearch() as Record<string, unknown>

  const queryParams: ExpenseListQueryParams = {
    page: search.page ? parseInt(search.page as string) : undefined,
    limit: search.limit ? parseInt(search.limit as string) : undefined,
    search: (search.search as string) || undefined,
    payment_status:
      (search.payment_status as ExpenseListQueryParams['payment_status']) ||
      undefined,
    contact_id: (search.contact_id as string) || undefined,
    company_id: (search.company_id as string) || undefined,
    order: (search.order as string) || undefined,
    date_from: search.date_from
      ? new Date(search.date_from as string)
      : undefined,
    date_to: search.date_to ? new Date(search.date_to as string) : undefined,
    tags: search.tags ? (search.tags as string).split(',') : undefined,
  }

  return (
    <ExpensesListsProvider paginationParams={queryParams}>
      <ExpensesListsContent />
    </ExpensesListsProvider>
  )
}

export default ExpensesLists
