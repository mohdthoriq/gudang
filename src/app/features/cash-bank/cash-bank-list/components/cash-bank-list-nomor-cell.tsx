import { useNavigate, useSearch } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import type { TransactionData } from '@/types'
import { LongText } from '@/components/long-text'
import { useCashBankLists } from './cash-bank-list-provider'

export function NavigationCell({
  row,
  name,
}: {
  row: Row<TransactionData>
  name: 'ref_number' | 'description'
}) {
  const { reference, id, desc, entry_number } = row.original
  const navigate = useNavigate()
  const { paginationParams } = useCashBankLists()
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const accountId = (paginationParams?.id || search?.id) as string

  const getReferenceNumber = () => {
    if (entry_number) return entry_number
    if (typeof reference === 'object' && reference !== null) return reference.number
    return '-'
  }

  return (
    <div
      className='cursor-pointer'
      onClick={() => {
        navigate({
          to: `/cash-bank/detail`,
          search: {
            accountId,
            transactionId: id,
          },
        })
      }}
    >
      <LongText className='text-primary max-w-xs truncate p-2 hover:underline'>
        {name === 'ref_number' ? getReferenceNumber() : desc}
      </LongText>
    </div>
  )
}
