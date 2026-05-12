import { useEffect, useRef, useState } from 'react'
import { getRouteApi, useLocation } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { CashBankListDialogs } from '../components/cash-bank-list-dialogs'
import { CashBankListFallback } from '../components/cash-bank-list-fallback'
import { CashBankListsProvider } from '../components/cash-bank-list-provider'
import { CashBankListsTable } from '../components/cash-bank-list-table'
import { CashBankPrimaryButton } from '../components/cash-bank-primary-button'
import { CashBankListsTablePrint } from '../components/print/cash-bank-list-transaction-print'
import type { CashBankListQueryParams } from '../hooks/use-cash-bank-list-query'

const route = getRouteApi('/_authenticated/cash-bank/$accountName')

function CashBankListsContent() {
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

  // const location = useLocation()

  // const accountData = location.state as unknown as Record<string, string>
  // const { accountName } = route.useParams()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.CASH_BANK_VIEW}
      fallback={<CashBankListFallback />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Kas
              </h2>
              <p className='text-muted-foreground'>Kelola Transaksi Kas.</p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button
                variant={'outline'}
                onClick={() => navigate({ to: '/cash-bank' })}
              >
                <ArrowLeft className='h-4 w-4' />
                Kembali
              </Button>
              <CashBankPrimaryButton />
              <Button variant={'outline'} onClick={() => handlePrint()}>
                {isPrinting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Printer className='h-4 w-4' />
                )}{' '}
                {isPrinting ? 'Memproses...' : 'Cetak'}
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <CashBankListsTable search={search} navigate={navigate} />
          <CashBankListDialogs />
        </CardContent>
      </Card>
      <div
        className={
          isPrinting ? 'absolute top-0 left-0 z-[-1] m-0 w-fit p-0' : 'hidden'
        }
      >
        <CashBankListsTablePrint ref={printRef} />
      </div>
    </PermissionGuard>
  )
}

function CashBankLists() {
  const search = route.useSearch() as Record<string, unknown>
  const navigate = route.useNavigate()
  const location = useLocation()
  const accountData = location.state as unknown as Record<string, string>

  const queryParams: CashBankListQueryParams = {
    id:
      (accountData?.accountId as string) || (search.id as string) || undefined,
    page: search.page ? parseInt(search.page as string) : undefined,
    limit: search.limit ? parseInt(search.limit as string) : undefined,
    order: (search.order as string) || undefined,
    date_from: search.date_from
      ? new Date(search.date_from as string)
      : undefined,
    date_to: search.date_to ? new Date(search.date_to as string) : undefined,
    search: (search.search as string) || undefined,
    tag: (search.tag as string) || undefined,
    reference_type: (search.reference_type as string) || undefined,
    total_from: search.total_from
      ? parseInt(search.total_from as string)
      : undefined,
    total_to: search.total_to ? parseInt(search.total_to as string) : undefined,
  }

  // Effect to persist accountId and accountCode in search params if they exist in state but not in search
  useEffect(() => {
    if (
      (accountData?.accountId && !search.id)
    ) {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          id: search.id || accountData?.accountId,
        }),
        replace: true,
      })
    }
  }, [
    accountData?.accountId,
    search.id,
    navigate,
  ])

  return (
    <CashBankListsProvider paginationParams={queryParams}>
      <CashBankListsContent />
    </CashBankListsProvider>
  )
}

export default CashBankLists
