import { type ColumnDef } from '@tanstack/react-table'
import { type Expedition } from '@/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Switch } from '@/components/ui/switch'
import { useToggleExpeditionStatusMutation } from '../hooks/use-expeditions-mutation'

export const expeditionsColumns: ColumnDef<Expedition>[] = [
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
        onClick={(e) => e.stopPropagation()}
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
      <DataTableColumnHeader column={column} title='Nama Ekspedisi' />
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
        'ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none',
        'w-full min-w-[300px]'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { id, is_active } = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const toggleMutation = useToggleExpeditionStatusMutation()

      return (
        <div className='flex items-center gap-2 p-2' onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={is_active}
            onCheckedChange={(val) => {
              toggleMutation.mutate({ id, is_active: val })
            }}
          />
        </div>
      )
    },
    meta: {
      className: 'min-w-[150px]',
    },
  }
]
