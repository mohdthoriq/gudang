import { type ColumnDef } from '@tanstack/react-table'
import { type PaymentTerm } from '@/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const paymentTermsColumns: ColumnDef<PaymentTerm>[] = [
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
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[40px]',
    },
  },
  {
    accessorKey: 'Nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Termin Pembayaran' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return (
        <div className='p-2'>
          <LongText className='min-w-36'>{name}</LongText>
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
    accessorKey: 'Lama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lama' />
    ),
    cell: ({ row }) => {
      const { days } = row.original
      return (
        <div className='w-full min-w-48 overflow-hidden p-2'>
          <LongText className='truncate'>{days}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full min-w-[700px]',
    },
  },
]
