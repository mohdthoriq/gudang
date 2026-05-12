import { Fragment } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import type { CashBankFormItemFormData } from '../types/cash-bank-form.schema'
import { CashBankItemRow } from './cash-bank-item-row'

type CashBankItemsTableProps = {
  fields: CashBankFormItemFormData[]
  remove: (index: number) => void
}

export function CashBankItemsTable({
  fields,
  remove,
}: CashBankItemsTableProps) {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })
  const taxesData = taxes?.data || []

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[200px]'>Akun</TableHead>
            <TableHead className='min-w-[200px]'>Deskripsi</TableHead>
            <TableHead className='min-w-[150px]'>Jumlah</TableHead>
            <TableHead className='min-w-[150px]'>Pajak</TableHead>
            <TableHead className='min-w-[100px] text-right'>Total</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <Fragment key={`item-${field.account_id}-${index}`}>
              <CashBankItemRow
                index={index}
                remove={remove}
                taxes={taxesData}
              />
            </Fragment>
          ))}
          {fields.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className='text-muted-foreground h-24 text-center'
              >
                Belum ada item. Tambahkan item baru.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
