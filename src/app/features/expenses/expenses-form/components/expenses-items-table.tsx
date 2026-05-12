import { Fragment, useMemo } from 'react'
import { type useForm } from 'react-hook-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import type {
  CreateExpenseFormData,
  ExpenseItemFormData,
  UpdateExpenseFormData,
} from '../types/expenses-form.schema'
import { ExpensesItemRow } from './expenses-item-row'

type ExpensesItemsTableProps = {
  fields: (ExpenseItemFormData & { id: string })[]
  form: ReturnType<
    typeof useForm<CreateExpenseFormData | UpdateExpenseFormData>
  >
  remove: (index: number) => void
}

export function ExpensesItemsTable({
  fields,
  form,
  remove,
}: ExpensesItemsTableProps) {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })

  const taxesData = useMemo(() => ({ data: taxes?.data || [] }), [taxes?.data])

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='h-8 px-2 text-xs'>Akun</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Deskripsi</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Pajak</TableHead>
            <TableHead className='h-8 px-2 text-right text-xs'>Total</TableHead>
            <TableHead className='h-8 px-2'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <ExpensesItemRow
                index={index}
                form={form}
                remove={remove}
                taxes={taxesData}
              />
            </Fragment>
          ))}
          {fields.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
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
