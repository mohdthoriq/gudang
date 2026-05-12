import { useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { type CashBankTransactionDetail, TransactionCode } from '@/types'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FeatureLockDialog } from '@/components/dialog/feature-lock.dialog'
import { useDeletePaymentTransactionMutation } from '../hooks/use-cash-bank-detail.mutation'
import { CashBankDeleteDialog } from './cash-bank-delete-dialog'

type CashBankRowActionsProps = {
  transaction: CashBankTransactionDetail
}

export function CashBankRowActions({ transaction }: CashBankRowActionsProps) {
  const navigate = useNavigate()
  const { openDialog } = useGlobalDialogStore()
  const [showLockDialog, setShowLockDialog] = useState(false)
  const [showLockDeleteDialog, setShowLockDeleteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const canEdit = useHasPermission(PERMISSION_KEY.CASH_BANK_EDIT)
  const canDelete = useHasPermission(PERMISSION_KEY.CASH_BANK_DELETE)

  const deleteMutation = useDeletePaymentTransactionMutation()

  const handleEdit = () => {
    if (!canEdit) {
      setShowLockDialog(true)
      return
    }

    if (transaction.transaction_type?.code === TransactionCode.BankTransfer) {
      openDialog('transfer', {
        data: transaction,
      })
      return
    }

    navigate({
      to: '/cash-bank/edit',
      search: {
        transactionId: transaction.id,
        accountId: transaction?.account?.id || '',
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(transaction.id, {
      onSuccess: () => {
        setShowDeleteDialog(false)
        navigate({
          to: '/cash-bank/$accountName',
          params: { accountName: transaction.account.name },
          search: { id: transaction.account.id }
        })
      },
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
            <DotsVerticalIcon className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className='h-4 w-4' />
            Ubah
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (canDelete) {
                setShowDeleteDialog(true)
              } else {
                setShowLockDeleteDialog(true)
              }
            }}
          >
            <Trash2Icon className='h-4 w-4' />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CashBankDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        transaction={transaction}
        isLoading={deleteMutation.isPending}
      />

      <FeatureLockDialog
        open={showLockDialog}
        onOpenChange={setShowLockDialog}
        feature='Ubah Transaksi'
      />

      <FeatureLockDialog
        open={showLockDeleteDialog}
        onOpenChange={setShowLockDeleteDialog}
        feature='Hapus Transaksi'
      />
    </>
  )
}
