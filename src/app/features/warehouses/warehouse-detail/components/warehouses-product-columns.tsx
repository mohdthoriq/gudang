import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export type WarehouseStockSummary = {
  name: string
  total_qty: number
  total_value: number
}

export const warehouseProductColumns: ColumnDef<WarehouseStockSummary>[] = [
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
        aria-label='Select row'
        className='translate-y-[2px] border-[#a8a8a8] dark:border-[#5c5c5c]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Produk' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return (
        <div className='p-2'>
          <LongText className='font-medium text-blue-600 max-w-[250px]'>{name}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'w-[40%] min-w-[200px] drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @xl/content:table-cell @xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Total Kuantitas',
    header: ({ column }) => (
      <div className='flex justify-center w-full'>
        <DataTableColumnHeader column={column} title='Total Kuantitas' />
      </div>
    ),
    cell: ({ row }) => {
      const { total_qty } = row.original
      return (
        <div className='w-full overflow-hidden p-2 flex justify-center'>
          <span>{total_qty || 0}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[30%] text-center',
    },
  },
  {
    accessorKey: 'Total Nilai', 
    header: ({ column }) => (
      <div className='flex justify-end w-full pr-2'>
        <DataTableColumnHeader column={column} title='Total Nilai' />
      </div>
    ),
    cell: ({ row }) => {
      const { total_value } = row.original
      return (
        <div className='w-full overflow-hidden p-2 text-right'>
          <span className='font-medium'>{total_value || 0}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[30%] text-right'
    },
  },
]