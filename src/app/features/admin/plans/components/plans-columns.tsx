import { type ColumnDef } from '@tanstack/react-table'
import { type Plan } from '@/types'
import { cn, formatNumber } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const plansColumns: ColumnDef<Plan>[] = [
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
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Plan' />
    ),
    cell: ({ row }) => {
      const { code } = row.original
      return (
        <div className='p-2'>
          <LongText>{code}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'w-full drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-sm:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Plan' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return (
        <div className='p-2'>
          <LongText>{name}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'w-full drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-sm:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Deskripsi' />
    ),
    cell: ({ row }) => {
      const { description } = row.original
      return (
        <div className='overflow-hidden p-2'>
          <LongText
            className='max-w-xs truncate'
            contentClassName='w-xs text-sm'
          >
            {description}
          </LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'monthly_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Harga Bulanan' />
    ),
    cell: ({ row }) => {
      const { monthly_price } = row.original
      const formattedPrice = formatNumber(monthly_price)
      return (
        <div className='overflow-hidden p-2'>
          <LongText className='truncate'>{formattedPrice}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'yearly_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Harga Tahunan' />
    ),
    cell: ({ row }) => {
      const { yearly_price } = row.original
      const formattedPrice = formatNumber(yearly_price)
      return (
        <div className='overflow-hidden p-2'>
          <LongText className='truncate'>{formattedPrice}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { is_active } = row.original
      return (
        <div className='overflow-hidden p-2'>
          <Badge
            variant='outline'
            className={cn(
              'rounded-md px-3 py-1 font-semibold transition-colors',
              is_active
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {is_active ? 'Aktif' : 'Tidak Aktif'}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
]
