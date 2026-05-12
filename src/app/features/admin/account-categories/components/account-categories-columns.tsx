import { type ColumnDef } from '@tanstack/react-table'
import { type AccountCategory } from '@/types'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Checkbox } from '@/components/ui/checkbox'


export const accountCategoriesColumns: ColumnDef<AccountCategory>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return (
        <div className='p-2'>
          <LongText className='min-w-sm'>{name}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'w-full min-w-[250px] drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky @xl/content:table-cell @xl/content:drop-shadow-none'
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
        <div className='w-full min-w-48 overflow-hidden p-2'>
          <LongText className='truncate'>{description}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full min-w-[200px]',
    },
  },
  {
    accessorKey: 'is_system',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sistem' />
    ),
    cell: ({ row }) => {
      const isSystem = row.original.is_system
      return (
        <div className='flex justify-center'>
          {isSystem ? (
            <div className='bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium'>
              Ya
            </div>
          ) : (
            <div className='bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs font-medium'>
              Tidak
            </div>
          )}
        </div>
      )
    },
    meta: {
      className: 'w-24',
    },
  },
]
