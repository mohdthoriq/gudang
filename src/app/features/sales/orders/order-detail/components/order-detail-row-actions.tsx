import { useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import type { SalesOrder } from '@/types'
import { PencilLineIcon, Trash2Icon, FileText, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { useSalesOrderMutation } from '../../order-detail/hooks/use-order-payments.mutation'
import { OrderDeleteDialog } from './order-delete-dialog'

interface OrderDetailRowActionsProps {
  order: SalesOrder
}

export function OrderDetailRowActions({ order }: OrderDetailRowActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [featureLockDialogOpen, setFeatureLockDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { deleteMutation, updateStatusMutation } = useSalesOrderMutation()

  const canDelete = useHasPermission(PERMISSION_KEY.SALES_ORDER_DELETE)

  const onConfirm = async () => {
    await deleteMutation.mutateAsync(order.id)
    setDeleteDialogOpen(false)
    navigate({ to: '/sales/orders' })
  }

  const handleUpdateStatus = async (status: string) => {
    await updateStatusMutation.mutateAsync({ 
      id: order.id, 
      data: { document_status: status, payment_status: order.payment_status, notes: '' } 
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsVerticalIcon className='h-8 w-8' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: '/sales/orders/edit',
                state: { currentRowId: order.id } as Record<string, unknown>,
              })
            }
          >
            <PencilLineIcon className='mr-2 h-4 w-4' /> Ubah
          </DropdownMenuItem>
          {order.document_status === 'draft' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('posted')}>
              <FileText className='mr-2 h-4 w-4' /> Posting
            </DropdownMenuItem>
          )}
          {order.document_status === 'posted' && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('void')}>
              <Ban className='mr-2 h-4 w-4' /> Batalkan (Void)
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              if (canDelete) {
                setDeleteDialogOpen(true)
              } else {
                setFeatureLockDialogOpen(true)
              }
            }}
            className='text-destructive focus:text-destructive'
          >
            <Trash2Icon className='mr-2 h-4 w-4' /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        order={order}
        isLoading={deleteMutation.isPending}
        onConfirm={onConfirm}
      />
      <FeatureLockDialog
        open={featureLockDialogOpen}
        onOpenChange={setFeatureLockDialogOpen}
        feature='Hapus Sales Order'
      />
    </>
  )
}
