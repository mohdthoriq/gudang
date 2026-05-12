import { type ColumnDef } from '@tanstack/react-table'
import type { CategorySalesReportItem } from '@/types/domain/sales-per-categories'
import { cn, formatCurrency } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const salesPerCategoriesColumns: ColumnDef<CategorySalesReportItem>[] = [
  {
    accessorKey: 'Nama Kategori',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Kategori' />
    ),
    cell: ({ row }) => {
      const { category_name } = row.original
      return (
        <div className='p-2'>
          <LongText>{category_name}</LongText>
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
    accessorKey: 'Jumlah Terjual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Terjual' />
    ),
    cell: ({ row }) => {
      const { quantity_sold } = row.original
      return (
        <div className='p-2'>
          <LongText>{quantity_sold}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Total Penjualan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Penjualan' />
    ),
    cell: ({ row }) => {
      const { total_sales } = row.original
      const formattedTotalSales = formatCurrency(total_sales)
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{formattedTotalSales}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
]
