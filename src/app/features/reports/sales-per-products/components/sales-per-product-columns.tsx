import { type ColumnDef } from '@tanstack/react-table'
import { cn, formatCurrency } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { ProductSalesReportItem } from '@/types/domain/sales-per-products'

export const salesPerProductColumns: ColumnDef<ProductSalesReportItem>[] = [
  {
    accessorKey: 'SKU',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    cell: ({ row }) => {
      const { product_code } = row.original
      return (
        <div className='p-2'>
          <LongText>{product_code}</LongText>
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
    accessorKey: 'Nama Produk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Produk' />
    ),
    cell: ({ row }) => {
      const { product_name } = row.original
      return (
        <div className='p-2'>
          <LongText>{product_name}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Kategori',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori' />
    ),
    cell: ({ row }) => {
      const { category_name } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{category_name}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Jumlah Terjual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Terjual' />
    ),
    cell: ({ row }) => {
      const { quantity_sold } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
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
  {
    accessorKey: 'Total Biaya',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Biaya' />
    ),
    cell: ({ row }) => {
      const { total_cost } = row.original
      const formattedTotalCost = formatCurrency(total_cost)
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{formattedTotalCost}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Laba Kotor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Laba Kotor' />
    ),
    cell: ({ row }) => {
      const { gross_profit } = row.original
      const formattedGrossProfit = formatCurrency(gross_profit)
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{formattedGrossProfit}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
]
