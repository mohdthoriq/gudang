import { useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import type { PurchaseInvoice } from '@/types'
import { EyeIcon, PencilLineIcon, Trash2Icon } from 'lucide-react'
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
import { useDeletePurchasesInvoiceMutation } from '../hooks/use-invoice-payments.mutation'
import { InvoiceDeleteDialog } from './invoice-delete-dialog'
import { PurchaseJournalDialog } from './purchase-journal-dialog'

type InvoiceDetailRowActionsProps = {
  invoice: PurchaseInvoice
}

export function InvoiceDetailRowActions({
  invoice,
}: InvoiceDetailRowActionsProps) {
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [featureLockDialogOpen, setFeatureLockDialogOpen] = useState(false)
  const [journalDialogOpen, setJournalDialogOpen] = useState(false)
  const deleteMutation = useDeletePurchasesInvoiceMutation()

  const canDelete = useHasPermission(PERMISSION_KEY.PURCHASE_INVOICE_DELETE)

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
          <DropdownMenuItem onClick={() => setJournalDialogOpen(true)}>
            <EyeIcon className='h-4 w-4' />
            Entri Jurnal
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: `/purchases/invoices/edit`,
                state: { currentRowId: invoice.id } as Record<string, unknown>,
              })
            }}
          >
            <PencilLineIcon className='h-4 w-4' />
            Ubah
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (canDelete) {
                setDeleteDialogOpen(true)
              } else {
                setFeatureLockDialogOpen(true)
              }
            }}
          >
            <Trash2Icon className='h-4 w-4' />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoiceDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        invoice={invoice}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(
            { ids: [invoice.id] },
            {
              onSuccess: () => {
                setDeleteDialogOpen(false)
                if (window.location.pathname.includes('/detail')) {
                  navigate({ to: '/purchases/invoices' })
                }
              },
            }
          )
        }}
      />
      <FeatureLockDialog
        open={featureLockDialogOpen}
        onOpenChange={setFeatureLockDialogOpen}
        feature='Hapus Tagihan Pembelian'
      />
      <PurchaseJournalDialog
        open={journalDialogOpen}
        onOpenChange={setJournalDialogOpen}
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoice_number}
      />
    </>
  )
}
