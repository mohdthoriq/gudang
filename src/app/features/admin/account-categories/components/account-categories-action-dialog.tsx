'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'
import { type AccountCategory } from '@/types'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTransactionTypesQuery } from '@/features/admin/transaction-types/hooks/use-transaction-types-query'
import { useAccountCategoriesForm } from '../hooks/use-account-categories-form'

type AccountCategoriesActionDialogProps = {
  currentRow?: AccountCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountCategoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: AccountCategoriesActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting } = useAccountCategoriesForm({
    currentRow,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'allowed_transactions',
  })

  const { data: transactionTypes } = useTransactionTypesQuery()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-2xl flex flex-col max-h-[90vh] p-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-6 text-start flex-none'>
          <DialogTitle>
            {isEdit ? 'Update Kategori Akun' : 'Tambah Kategori Akun'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update kategori akun disini.'
              : 'Tambah kategori akun baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <Form {...form}>
            <form
              id='account-category-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kategori</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan nama kategori akun...'
                          autoComplete='off'
                          {...field}
                        />
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
                        placeholder='Masukkan deskripsi kategori akun...'
                        className='min-h-[80px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-4 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-semibold'>
                    Transaksi Diizinkan
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append({ transaction_type_id: '' })}
                  >
                    <Plus className='mr-2 h-4 w-4' /> Tambah
                  </Button>
                </div>

                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow className='bg-muted/50'>
                        <TableHead className='px-4'>Nama Transaksi</TableHead>
                        <TableHead className='w-[60px]'></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className='text-muted-foreground h-20 text-center text-sm italic'
                          >
                            Belum ada transaksi terpilih. Klik tambah untuk
                            memulai.
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell className='p-2 px-4'>
                              <FormField
                                control={form.control}
                                name={`allowed_transactions.${index}.transaction_type_id`}
                                render={({ field: selectField }) => (
                                  <FormItem>
                                    <Select
                                      onValueChange={selectField.onChange}
                                      value={selectField.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className='border-none bg-transparent shadow-none focus:ring-0'>
                                          <SelectValue placeholder='Pilih transaksi...' />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {transactionTypes?.data?.map((t) => (
                                          <SelectItem key={t.id} value={t.id}>
                                            {t.name} ({t.code})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className='p-2 px-4 text-center'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-destructive hover:bg-destructive/10'
                                onClick={() => remove(index)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className='px-6 pb-6 border-t pt-4 flex-none'>
          <Button
            type='submit'
            form='account-category-form'
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Kategori Akun' : 'Tambah Kategori Akun'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
