import { type ColumnDef, type Row } from '@tanstack/react-table'
import { type Account } from '@/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { useAccounts } from './account-provider'

// eslint-disable-next-line
const NameCell = ({ row }: { row: Row<Account> }) => {
  const account = row.original
  const { setOpen, setCurrentRow } = useAccounts()

  return (
    <div
      className='flex items-center p-2'
      style={{ paddingLeft: `${row.depth * 1}rem` }}
    >
      {row.getCanExpand() ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='mr-2 h-6 w-6 p-0 hover:bg-transparent'
              onClick={(e) => {
                e.stopPropagation()
                row.toggleExpanded()
              }}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {row.getIsExpanded() ? 'Tutup sub akun' : 'Lihat sub akun'}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className='w-6' />
      )}
      <div
        className='cursor-pointer text-blue-600 hover:underline'
        onClick={() => {
          setCurrentRow(account)
          setOpen('edit')
        }}
      >
        <LongText className='truncate font-medium'>{account.name}</LongText>
      </div>
    </div>
  )
}

// eslint-disable-next-line
const SaldoCell = ({ row }: { row: Row<Account> }) => {
  const account = row.original
  const isBalanceMinus = account.balance < 0
  const { setOpen, setCurrentRow } = useAccounts()

  return (
    <div
      className={cn(
        'cursor-pointer overflow-hidden p-2 hover:underline',
        isBalanceMinus ? 'text-red-600' : 'text-blue-600'
      )}
      onClick={() => {
        setCurrentRow(account)
        setOpen('ledger')
      }}
    >
      <LongText className='truncate'>{formatNumber(account.balance)}</LongText>
    </div>
  )
}

export const accountsColumns: ColumnDef<Account>[] = [
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
    accessorKey: 'Kode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode' />
    ),
    cell: ({ row }) => {
      const { code } = row.original
      return (
        <div className='p-2'>
          <LongText className='max-w-xs truncate'>{code}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'min-w-[150px] drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @xl/content:table-cell @xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: NameCell,
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
      const { category } = row.original
      return (
        <div className='w-full min-w-48 overflow-hidden p-2'>
          <LongText className='truncate'>{category.name}</LongText>
        </div>
      )
    },
    meta: {
      className: 'min-w-[150px]',
    },
  },
  {
    accessorKey: 'Saldo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Saldo' />
    ),
    cell: SaldoCell,
    meta: {
      className: 'w-full',
    },
  },
]
