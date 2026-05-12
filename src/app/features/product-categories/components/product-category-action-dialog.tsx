'use client'

import type { ProductCategory } from '@/types'
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
import { Textarea } from '@/components/ui/textarea'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useProductCategoryForm } from '../hooks/use-product-category-form'

type ProductCategoryActionDialogProps = {
  currentRow?: ProductCategory
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: ProductCategory) => void
}

export function ProductCategoryActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ProductCategoryActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, errorMessage } = useProductCategoryForm({
    currentRow,
    onSuccess,
  })

  const hasPermission = useHasPermission(
    isEdit
      ? PERMISSION_KEY.PRODUCT_CATEGORY_EDIT
      : PERMISSION_KEY.PRODUCT_CATEGORY_ADD
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className={cn('flex flex-col sm:max-w-lg')}>
        <DialogHeader className={cn('text-start')}>
          <DialogTitle>
            {isEdit ? 'Update Kategori Produk' : 'Tambah Kategori Produk'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update kategori produk disini.'
              : 'Tambah kategori produk baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn('relative py-4')}>
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori Produk</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama kategori produk...'
                        autoComplete='off'
                        type='text'
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan deskripsi...'
                        {...field}
                        className='min-h-[100px] resize-none'
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
            <UpgradePlanCard feature='Tambah Kategori' type='dialog' />
          )}
        </div>
        {errorMessage && (
          <Alert
            variant='destructive'
            className={cn(
              'w-full',
              !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
            )}
          >
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button type='submit' form='account-form'>
            {isEdit ? 'Update Kategori' : 'Tambah Kategori'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
