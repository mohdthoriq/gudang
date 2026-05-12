import type { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { transactionTypeSchema } from '../types/transaction-types.schema'
import {
  useCreateTransactionTypeMutation,
  useUpdateTransactionTypeMutation,
} from '../hooks/use-transaction-types-mutation'
import type { TransactionType } from '@/types'

interface TransactionTypesActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: TransactionType | null
}

export function TransactionTypesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: TransactionTypesActionDialogProps) {
  const isEdit = !!currentRow
  const createMutation = useCreateTransactionTypeMutation()
  const updateMutation = useUpdateTransactionTypeMutation()

  const form = useForm<z.infer<typeof transactionTypeSchema>>({
    resolver: zodResolver(transactionTypeSchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset(currentRow)
    } else {
      form.reset({
        name: '',
        code: '',
        description: '',
      })
    }
  }, [currentRow, form, isEdit, open])

  const onSubmit = async (values: z.infer<typeof transactionTypeSchema>) => {
    const formattedValues = {
      ...values,
      code: values.code
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, ''),
    }

    if (isEdit && currentRow) {
      await updateMutation.mutateAsync({
        id: currentRow.id,
        data: formattedValues,
      })
    } else {
      await createMutation.mutateAsync(formattedValues)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-lg flex flex-col max-h-[90vh] p-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 text-start flex-none'>
          <DialogTitle>
            {isEdit ? 'Edit Tipe Transaksi' : 'Tambah Tipe Transaksi'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ubah detail tipe transaksi di sini.'
              : 'Tambahkan tipe transaksi baru.'}
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='transaction-types-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Contoh: sales_invoice'
                        {...field}
                        readOnly={isEdit}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder='Contoh: Penjualan Tunai' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Deskripsi singkat...'
                        className='min-h-[100px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className='px-6 pb-6 border-t pt-4 flex-none'>
          <Button
            type='submit'
            form='transaction-types-form'
            disabled={isSubmitting}
          >
            {isEdit ? 'Simpan Perubahan' : 'Buat Baru'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
