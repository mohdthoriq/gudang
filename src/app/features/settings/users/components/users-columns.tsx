import { type ColumnDef } from '@tanstack/react-table'
import { type User } from '@/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { UserStatusSwitch } from './users-status-switch'

export const getUsersColumns = (
  isAdmin: boolean,
  currentUserId?: string
): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
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
        <DataTableColumnHeader column={column} title='Nama Lengkap' />
      ),
      cell: ({ row }) => {
        const { full_name } = row.original
        return (
          <div className='px-2'>
            <LongText>{full_name}</LongText>
          </div>
        )
      },
      meta: {
        className: cn(
          'w-full min-w-[150px] drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
          'ps-0.5 max-md:sticky @xl/content:table-cell @xl/content:drop-shadow-none'
        ),
      },
      enableHiding: false,
    },
    {
      accessorKey: 'Email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => {
        const { email } = row.original
        return (
          <div className='w-full min-w-48 overflow-hidden px-2'>
            <LongText className='truncate'>{email}</LongText>
          </div>
        )
      },
      meta: {
        className: 'w-full',
      },
    },
    {
      accessorKey: 'Peran',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Peran' />
      ),
      cell: ({ row }) => {
        const { role } = row.original
        return (
          <div className='w-full min-w-48 overflow-hidden px-2'>
            <LongText className='truncate'>{role.name}</LongText>
          </div>
        )
      },
      meta: {
        className: 'w-full px-12',
      },
    },
    {
      accessorKey: 'Status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const { is_active } = row.original
        return (
          <div className='w-full min-w-48 overflow-hidden px-2'>
            <LongText className='truncate'>
              {is_active ? 'Aktif' : 'Tidak Aktif'}
            </LongText>
          </div>
        )
      },
      meta: {
        className: 'w-full px-12',
      },
    },
  ]

  if (isAdmin) {
    columns.push({
      id: 'active_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => (
        <UserStatusSwitch
          user={row.original}
          disabled={row.original.id === currentUserId}
        />
      ),
    })
  }

  return columns
}
