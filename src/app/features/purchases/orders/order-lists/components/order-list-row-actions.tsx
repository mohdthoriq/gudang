import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import {
  Archive,
  CheckCircle2,
  Copy,
  Edit,
  FileDown,
  MoreHorizontal,
  Printer,
  Trash2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/dialog/confirm.dialog'
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { usePurchasesOrderMutation } from '../../order-detail/hooks/use-order-payments.mutation'
import type { PurchasesOrder } from '@/types'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate()
  const order = row.original as PurchasesOrder
  const { deleteMutation, updateStatusMutation } = usePurchasesOrderMutation()
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [lockFeature, setLockFeature] = useState('')

  const canEdit = useHasPermission(PERMISSION_KEY.PURCHASE_ORDER_EDIT)
  const canDelete = useHasPermission(PERMISSION_KEY.PURCHASE_ORDER_DELETE)

  const handleAction = (action: () => void, permission: boolean, featureName: string) => {
    if (!permission) {
      setLockFeature(featureName)
      setLockDialogOpen(true)
    } else {
      action()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_number)
    toast.success('Nomor pesanan berhasil disalin.')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Buka menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[180px]'>
          <DropdownMenuItem onClick={() => navigate({ 
            to: '/purchases/orders/detail',
            state: { currentRowId: order.id } as Record<string, unknown>
          })}>
            <FileDown className='mr-2 h-4 w-4' />
            Lihat Detail
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleAction(
            () => navigate({ 
              to: '/purchases/orders/edit',
              state: { currentRowId: order.id } as Record<string, unknown>
            }),
            canEdit,
            'Edit Pesanan Pembelian'
          )}>
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopy}>
            <Copy className='mr-2 h-4 w-4' />
            Salin Nomor
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            disabled={order.document_status === 'posted'}
            onClick={() => updateStatusMutation.mutate({ id: order.id, data: { document_status: 'posted', payment_status: order.payment_status, notes: '' } })}
          >
            <CheckCircle2 className='mr-2 h-4 w-4 text-emerald-500' />
            Posting Order
          </DropdownMenuItem>

          <DropdownMenuItem 
            disabled={order.document_status === 'draft'}
            onClick={() => updateStatusMutation.mutate({ id: order.id, data: { document_status: 'draft', payment_status: order.payment_status, notes: '' } })}
          >
            <Archive className='mr-2 h-4 w-4 text-amber-500' />
            Kembalikan ke Draft
          </DropdownMenuItem>

          <DropdownMenuItem 
            disabled={order.document_status === 'void'}
            onClick={() => updateStatusMutation.mutate({ id: order.id, data: { document_status: 'void', payment_status: order.payment_status, notes: '' } })}
          >
            <XCircle className='mr-2 h-4 w-4 text-red-500' />
            Batalkan Order
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleCopy}>
            <Printer className='mr-2 h-4 w-4' />
            Cetak
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className='text-red-600 focus:text-red-600'
            onClick={() => handleAction(
              () => setDeleteDialogOpen(true),
              canDelete,
              'Hapus Pesanan Pembelian'
            )}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title='Hapus Pesanan Pembelian'
        desc='Apakah Anda yakin ingin menghapus purchase order ini? Tindakan ini tidak dapat dibatalkan.'
        confirmText='Hapus'
        destructive
        isLoading={deleteMutation.isPending}
        handleConfirm={() => {
          deleteMutation.mutate(order.id, {
            onSuccess: () => setDeleteDialogOpen(false),
          })
        }}
      />

      <FeatureLockDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        feature={lockFeature}
      />
    </>
  )
}
