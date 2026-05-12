import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import type { TransactionData } from '@/types'
import { cn, formatNumber } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { NavigationCell } from './cash-bank-list-nomor-cell'

export const cashBankListsColumns: ColumnDef<TransactionData>[] = [
  {
    accessorKey: 'Tanggal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal' />
    ),
    cell: ({ row }) => {
      const { trans_date } = row.original
      const formattedDate = format(trans_date, 'dd/MM/yyyy')
      return (
        <div className='p-2'>
          <LongText className='truncate'>{formattedDate}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-[120px]',
    },
  },
  {
    accessorKey: 'Nomor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor' />
    ),
    cell: ({ row }) => <NavigationCell row={row} name={'ref_number'} />,
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Deskripsi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deskripsi' />
    ),
    cell: ({ row }) => <NavigationCell row={row} name={'description'} />,
    meta: {
      className: 'w-full ',
    },
  },
  {
    accessorKey: 'Referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Referensi' />
    ),
    cell: ({ row }) => {
      const { note, reference } = row.original
      const displayNote =
        note || (typeof reference === 'string' ? reference : '')

      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{displayNote || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Tag',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tag' />
    ),
    cell: ({ row }) => {
      const { tags } = row.original
      return (
        <div className='flex flex-wrap gap-1 p-2'>
          {tags.map((tag) => {
            const tagName = typeof tag === 'object' ? tag.name : tag
            return (
              <Badge key={tagName} variant='outline' className='text-[10px]'>
                {tagName}
              </Badge>
            )
          })}
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Terima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Terima' />
    ),
    cell: ({ row }) => {
      const { amount_after_tax } = row.original
      const displayValue = amount_after_tax > 0 ? formatNumber(amount_after_tax) : ''
      return (
        <div className='p-2 text-right'>
          <LongText className='truncate'>{displayValue}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Kirim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kirim' />
    ),
    cell: ({ row }) => {
      const { amount_after_tax } = row.original
      const displayValue =
        amount_after_tax < 0 ? formatNumber(Math.abs(amount_after_tax)) : ''
      return (
        <div className='p-2 text-right'>
          <LongText className='truncate'>{displayValue}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Saldo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Saldo' />
    ),
    cell: ({ row }) => {
      const { balance } = row.original
      const isNegative = balance < 0
      const formattedBalance = formatNumber(Math.abs(balance))
      const displayValue = isNegative ? `(${formattedBalance})` : formattedBalance
      return (
        <div className='p-2 text-right'>
          <LongText className='truncate'>{displayValue}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  // {
  //   accessorKey: 'Status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const { status } = row.original
  //     return (
  //       <div className='p-2'>
  //         <Badge className={cn(getStatusStyles(status))}>{status}</Badge>
  //       </div>
  //     )
  //   },
  //   meta: {
  //     className: 'w-full',
  //   },
  // },
]
