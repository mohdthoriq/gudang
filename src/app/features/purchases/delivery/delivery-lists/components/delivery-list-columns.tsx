import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import type { PurchaseDelivery } from '@/types'
import { cn, getStatusStyles, invoiceLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const purchaseDeliveryListsColumns: ColumnDef<PurchaseDelivery>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px] border-[#a8a8a8] dark:border-[#5c5c5c]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label='Select row'
        className='translate-y-[2px] border-[#a8a8a8] dark:border-[#5c5c5c]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-4 p-2 z-9000',
    },
  },
  {
    accessorKey: 'Nomor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor' />
    ),
    cell: ({ row }) => {
      const { number, id } = row.original
      return (
        <div className='p-2'>
          <Link
            to='/purchases/delivery/detail'
            state={{ currentRowId: id } as Record<string, unknown>}
          >
            <LongText className='text-primary cursor-pointer hover:underline'>
              {number}
            </LongText>
          </Link>
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Vendor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vendor' />
    ),
    cell: ({ row }) => {
      const { customer } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>
            {typeof customer === 'string' ? customer : customer?.name || '-'}
          </LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Referensi' />
    ),
    cell: ({ row }) => {
      const { reference } = row.original
      return (
        <div className='p-2'>
          <LongText className='truncate'>{reference || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Ekspedisi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ekspedisi' />
    ),
    cell: ({ row }) => {
      const { expedition } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>
            {typeof expedition === 'string'
              ? expedition
              : expedition?.name || '-'}
          </LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Tanggal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal' />
    ),
    cell: ({ row }) => {
      const { date } = row.original
      const formattedDate = date
        ? format(new Date(date), 'dd/MM/yyyy')
        : '-'
      return (
        <div className='p-2'>
          <LongText className='truncate'>{formattedDate}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      return (
        <div className='p-2'>
          <Badge className={cn(getStatusStyles(status))}>
            {invoiceLabel[status] || status}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
]
