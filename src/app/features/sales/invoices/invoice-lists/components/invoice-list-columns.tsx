import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import type { SalesInvoice } from '@/types'
import { format } from '@/lib/date'
import { cn, formatNumber, getStatusStyles, invoiceLabel } from '@/lib/utils'
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

export const invoiceListsColumns: ColumnDef<SalesInvoice>[] = [
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
      const { invoice_number, id, sales_invoice_items } = row.original
      return (
        <div className='p-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/sales/invoices/detail'
                state={{ currentRowId: id } as Record<string, unknown>}
              >
                <LongText className='text-primary cursor-pointer hover:underline'>
                  {invoice_number}
                </LongText>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className='border-border w-80 p-0 bg-white dark:bg-secondary group-hover:bg-muted/100'
              arrowClassName='bg-white dark:bg-secondary'
            >
              <Table>
                <TableHeader className='bg-white dark:bg-secondary'>
                  {' '}
                  <TableRow className='border-b hover:bg-transparent'>
                    <TableHead className='text-foreground px-3 py-4 text-xs font-semibold'>
                      Item
                    </TableHead>
                    <TableHead className='text-foreground px-3 py-4 text-right text-xs font-semibold'>
                      Qty
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales_invoice_items?.length > 0 ? (
                    sales_invoice_items.map((item) => (
                      <TableRow
                        key={item.id}
                        className='border-b last:border-0 bg-background'
                      >
                        <TableCell className='text-foreground px-3 py-4 text-xs'>
                          {item.product?.name}
                        </TableCell>
                        <TableCell className='text-foreground px-3 py-4 text-right text-xs'>
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
    accessorKey: 'Pelanggan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pelanggan' />
    ),
    cell: ({ row }) => {
      const { customer } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{customer?.name}</LongText>
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
    accessorKey: 'Tanggal Invoice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Invoice' />
    ),
    cell: ({ row }) => {
      const { invoice_date } = row.original
      const formattedDate = format(invoice_date, 'dd/MM/yyyy')
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
      const formattedDate = due_date ? format(due_date, 'dd/MM/yyyy') : '-'
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
      const { payment_status } = row.original
      return (
        <div className='p-2'>
          <Badge className={cn(getStatusStyles(payment_status))}>
            {invoiceLabel[payment_status] || payment_status}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-full px-2',
    },
  },
  {
    accessorKey: 'Pembayaran Kas & Bank',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pembayaran Kas & Bank' />
    ),
    cell: ({ row }) => {
      const { is_pos, payments } = row.original
      const accountName = is_pos ? payments?.[0]?.account?.name || '-' : ''
      const methodName = is_pos ? payments?.[0]?.method || '-' : ''

      return (
        <div className='p-2'>
          <LongText className='truncate font-medium'>{accountName}</LongText>
          <LongText className='truncate text-secondary-foreground/80'>{methodName}</LongText>
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
