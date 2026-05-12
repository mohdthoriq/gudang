import { type ColumnDef } from '@tanstack/react-table'
import { type Contact } from '@/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const contactsColumns: ColumnDef<Contact>[] = [
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
    accessorKey: 'Nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return (
        <div className='p-2'>
          <LongText className=''>{name}</LongText>
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
    accessorKey: 'Tipe Kontak',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipe Kontak' />
    ),
    cell: ({ row }) => {
      const { type } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{type.name}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Perusahaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Perusahaan' />
    ),
    cell: ({ row }) => {
      const { company_name } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{company_name || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const { email } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{email || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Telepon',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Telepon' />
    ),
    cell: ({ row }) => {
      const { phone } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{phone || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
  {
    accessorKey: 'Alamat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Alamat' />
    ),
    cell: ({ row }) => {
      const { address } = row.original
      return (
        <div className='w-full overflow-hidden p-2'>
          <LongText className='truncate'>{address || '-'}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-full',
    },
  },
]
