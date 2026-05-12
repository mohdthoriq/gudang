import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import type { PurchasesOrder } from '@/types'
import { cn, formatNumber, getStatusStyles, orderLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const orderListsColumns: ColumnDef<PurchasesOrder>[] = [
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
    accessorKey: 'Nomor Pesanan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor' />
    ),
    cell: ({ row }) => {
      const { order_number, id, purchase_order_items } = row.original
      return (
        <div className='p-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/purchases/orders/detail'
                state={{ currentRowId: id } as Record<string, unknown>}
              >
                <LongText className='text-primary cursor-pointer hover:underline'>
                  {order_number}
                </LongText>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className='border-border w-80 bg-white p-0'
              arrowClassName='bg-white fill-white'
            >
              <Table>
                <TableHeader className='bg-white'>
                  <TableRow className='border-b hover:bg-transparent'>
                    <TableHead className='text-foreground h-9 px-3 text-xs font-semibold'>
                      Item
                    </TableHead>
                    <TableHead className='text-foreground h-9 px-3 text-right text-xs font-semibold'>
                      Qty
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase_order_items?.length > 0 ? (
                    purchase_order_items.map((item) => (
                      <TableRow
                        key={item.id}
                        className='border-b last:border-0 hover:bg-slate-50/50'
                      >
                        <TableCell className='text-foreground px-3 py-2 text-xs'>
                          {item.product?.name || item.description}
                        </TableCell>
                        <TableCell className='text-foreground px-3 py-2 text-right text-xs'>
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className='text-muted-foreground h-12 text-center text-xs'
                      >
                        No items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TooltipContent>
          </Tooltip>
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
      const { vendor } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{vendor?.name || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Referensi' />
    ),
    cell: ({ row }) => {
      const { note } = row.original
      return (
        <div className='p-2 text-center'>
          <LongText className='truncate'>{note || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Tanggal Pesanan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Pesanan' />
    ),
    cell: ({ row }) => {
      const { order_date } = row.original
      const formattedDate = order_date
        ? format(new Date(order_date), 'dd/MM/yyyy')
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
    accessorKey: 'Jatuh Tempo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jatuh Tempo' />
    ),
    cell: ({ row }) => {
      const { due_date } = row.original
      const formattedDate = due_date
        ? format(new Date(due_date), 'dd/MM/yyyy')
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
  // {
  //   accessorKey: 'Status Dokumen',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status Dokumen' />
  //   ),
  //   cell: ({ row }) => {
  //     const { document_status } = row.original
  //     return (
  //       <div className='p-2'>
  //         <Badge className={cn(getStatusStyles(document_status))}>
  //           {orderLabel[document_status] || document_status}
  //         </Badge>
  //       </div>
  //     )
  //   },
  //   meta: {
  //     className: 'w-full px-2',
  //   },
  // },
  {
    accessorKey: 'Status Pembayaran',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { payment_status } = row.original
      return (
        <div className='p-2'>
          <Badge className={cn(getStatusStyles(payment_status))}>
            {orderLabel[payment_status] || payment_status}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Uang Muka (DP)',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DP' />
    ),
    cell: ({ row }) => {
      const { dp_amount } = row.original
      const formattedDP = formatNumber(dp_amount || 0)
      return (
        <div className='p-2'>
          <LongText className='truncate'>{formattedDP}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Sisa Tagihan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sisa Tagihan' />
    ),
    cell: ({ row }) => {
      const { outstanding } = row.original
      const formattedOutstanding = formatNumber(outstanding)
      return (
        <div className='p-2'>
          <LongText className='truncate'>{formattedOutstanding}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      const { total } = row.original
      const formattedTotal = formatNumber(total)
      return (
        <div className='p-2'>
          <LongText className='truncate'>{formattedTotal}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
]
