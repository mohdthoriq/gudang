'use client'

import { useEffect, useRef } from 'react'
import { type Account } from '@/types'
import { CheckCircle2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import {
  useAccountsForm,
  type UseAccountsFormProps,
} from '../hooks/use-account-form'
import { AccountCategoryCombobox } from './account-category-combobox'
import { AccountsCombobox } from './account-combobox'
import { useAccountCategoriesQuery } from '@/features/admin/account-categories/hooks/use-account-categories-query'

type AccountsActionDialogProps = {
  currentRow?: UseAccountsFormProps['currentRow']
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: Account) => void
}

export function AccountsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: AccountsActionDialogProps) {
  const isEdit = !!currentRow?.id

  const { form, onSubmit, isSubmitting, errorMessage } = useAccountsForm({
    currentRow,
    onSuccess,
  })

  const categoryId = form.watch('category_id')

  const prevCategoryId = useRef(categoryId)

  const hasPermission = useHasPermission(
    isEdit ? PERMISSION_KEY.ACCOUNT_EDIT : PERMISSION_KEY.ACCOUNT_ADD
  )

  const { data: categories } = useAccountCategoriesQuery({
    is_cash_bank: currentRow?.is_cash_bank,
  })

  useEffect(() => {
    if (
      !isEdit &&
      currentRow?.is_cash_bank &&
      categories?.data.length &&
      !form.getValues('category_id')
    ) {
      const cashBankCategory = categories.data.find((c) => c.is_cash_bank)
      if (cashBankCategory) {
        form.setValue('category_id', cashBankCategory.id)
      }
    }
  }, [categories, currentRow?.is_cash_bank, form, isEdit])

  useEffect(() => {
    if (prevCategoryId.current !== categoryId) {
      form.setValue('parent_id', undefined)
      prevCategoryId.current = categoryId
    }
  }, [categoryId, form])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='flex max-h-[80vh] flex-col sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Update Akun' : 'Tambah Akun'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update akun disini.'
              : 'Tambah akun baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[50vh] w-full'>
          <div className={cn('py-4 pr-4 pl-2', !hasPermission && 'relative')}>
            <Form {...form}>
              <form
                id='account-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                  'space-y-4',
                  !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
                )}
              >
                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Akun</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan kode akun...'
                          autoComplete='off'
                          {...field}
                          disabled={!hasPermission}
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
                      <FormLabel>Nama Akun</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Masukkan nama akun...'
                          autoComplete='off'
                          {...field}
                          disabled={!hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Akun</FormLabel>
                      <FormControl>
                        <AccountCategoryCombobox
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          disabled={!hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='parent_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Akun dari</FormLabel>
                      <FormControl>
                        <AccountsCombobox
                          placeholder='Pilih akun...'
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                          categoryId={categoryId}
                          codePrefixes={
                            currentRow?.is_cash_bank ? ['1-100'] : undefined
                          }
                          disabled={!categoryId || !hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='allow_transaction'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Izinkan Transaksi</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === 'true')
                          }
                          value={field.value ? 'true' : 'false'}
                          disabled={!hasPermission}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Pilih opsi...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='true'>Ya</SelectItem>
                            <SelectItem value='false'>Tidak</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='is_active'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktif</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === 'true')
                          }
                          value={field.value ? 'true' : 'false'}
                          disabled={!hasPermission}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Pilih opsi...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='true'>Ya</SelectItem>
                            <SelectItem value='false'>Tidak</SelectItem>
                          </SelectContent>
                        </Select>
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
                          placeholder='Masukkan deskripsi...'
                          className='min-h-[100px] resize-none'
                          {...field}
                          disabled={!hasPermission}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            {!hasPermission && (
              <UpgradePlanCard
                type='dialog'
                feature={isEdit ? 'Edit Akun' : 'Tambah Akun'}
              />
            )}
          </div>
        </ScrollArea>
        {errorMessage && (
          <Alert variant='destructive' className='w-full'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button type='submit' form='account-form' disabled={isSubmitting}>
            {isEdit ? 'Update Akun' : 'Tambah Akun'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
