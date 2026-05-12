import { useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { getTransactionTitle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CashBankDetailReceipt } from './components/cash-bank-receipt'
import { useCashBankDetailQuery } from './hooks/use-cash-bank-detail-query'

export function CashBankDetail() {
  const search = useSearch({ strict: false }) as Record<string, string>
  // const navigate = useNavigate()

  const transactionId = search.transactionId || search.currentRowId
  const accountId = search.accountId

  const { data: transaction, isLoading } = useCashBankDetailQuery({
    transactionId,
    accountId,
  })

  if (!transactionId || !accountId) {
    return (
      <Card className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <CardContent>
          <p className='text-muted-foreground'>
            ID Transaksi atau ID Akun tidak ditemukan.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant='outline'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Kembali
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center font-medium'>
        Memuat data transaksi...
      </div>
    )
  }

  if (!transaction) {
    return (
      <Card className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <CardContent>
          <p className='text-muted-foreground'>
            Data transaksi tidak ditemukan.
          </p>
          <Button onClick={() => history.back()} variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Kembali
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4 font-sans'>
      <Card  className='gap-1'>
        <CardHeader className='py-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold'>
                {getTransactionTitle(transaction.transaction_type?.code)}
              </h1>
            </div>
            <div className='mr-4 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => history.back()}
                className='h-8 gap-2 px-3 text-xs'
              >
                <ArrowLeft className='h-3.5 w-3.5' /> Kembali
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <CashBankDetailReceipt transaction={transaction} />
        </CardContent>
      </Card>
    </div>
  )
}
