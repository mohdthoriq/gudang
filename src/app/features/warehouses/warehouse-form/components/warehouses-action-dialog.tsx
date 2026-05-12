'use client'

import { type Warehouse } from '@/types'
import { CheckCircle2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
// import { PERMISSION_KEY } from '@/constants/permissions'
// import { useHasPermission } from '@/hooks/use-has-permission'
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
import { useWarehousesForm } from '../hooks/use-warehouses-form'

type WarehousesActionDialogProps = {
  currentRow?: Warehouse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: unknown) => void
}

export function WarehousesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: WarehousesActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = useWarehousesForm({
    currentRow,
    onSuccess,
  })

  // const hasPermission = useHasPermission(
  //   isEdit ? PERMISSION_KEY.WAREHOUSE_EDIT : PERMISSION_KEY.WAREHOUSE_ADD
  // )
  const hasPermission = true


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset(currentRow)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Update Gudang' : 'Tambah Gudang'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update gudang disini.'
              : 'Tambah gudang baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              id='warehouse-form'
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
                    <FormLabel>Nama Gudang</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama gudang...'
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
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Gudang</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan kode gudang...'
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan deskripsi gudang...'
                        className='resize-none'
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
              feature={isEdit ? 'Edit Gudang' : 'Tambah Gudang'}
            />
          )}
        </div>
        {errorMessage && (
          <Alert variant='destructive' className='w-full'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button type='submit' form='warehouse-form' disabled={isSubmitting}>
            {isEdit ? 'Update Gudang' : 'Tambah Gudang'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
