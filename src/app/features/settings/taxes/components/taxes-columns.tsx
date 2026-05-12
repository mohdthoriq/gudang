import { type ColumnDef } from '@tanstack/react-table'
import { type Tax } from '@/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { TaxStatusSwitch } from './taxes-status-switch'

export const taxesColumns: ColumnDef<Tax>[] = [
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
      <DataTableColumnHeader column={column} title='Nama Pajak' />
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
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Persentase',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Persentase' />
    ),
    cell: ({ row }) => {
      const { rate } = row.original
      return (
        <div className='p-2'>
          <LongText className='truncate'>{rate}%</LongText>
        </div>
      )
    },
  },
  {
    accessorKey: 'Akun Pajak Penjualan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Akun Pajak Penjualan' />
    ),
    cell: ({ row }) => {
      const { sell_account } = row.original
      return (
        <div className='p-2'>
          <LongText className='truncate'>
            {sell_account?.ref_code} - {sell_account?.name}
          </LongText>
        </div>
      )
    },
  },
  {
    accessorKey: 'Akun Pajak Pembelian',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Akun Pajak Pembelian' />
    ),
    cell: ({ row }) => {
      const { buy_account } = row.original
      return (
        <div className='p-2'>
          <LongText className='truncate'>
            {buy_account?.ref_code} - {buy_account?.name}
          </LongText>
        </div>
      )
    },
  },
  {
    accessorKey: 'Pemotongan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pemotongan' />
    ),
    cell: ({ row }) => {
      const { is_withholding } = row.original
      return (
        <div className='p-2'>
          <LongText className='truncate'>
            {is_withholding ? 'Ya' : 'Tidak'}
          </LongText>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'Deskripsi',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Deskripsi' />
  //   ),
  //   cell: ({ row }) => {
  //     const { description } = row.original
  //     return (
  //       <div className='p-2'>
  //         <LongText className='line-clamp-1'>{description || '-'}</LongText>
  //       </div>
  //     )
  //   },
  //   meta: {
  //     className: 'w-full',
  //   },
  // },
  {
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => <TaxStatusSwitch tax={row.original} />,
  },
]
