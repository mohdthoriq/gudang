'use client'

import type { Tag } from '@/types'
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
import { useTagsForm } from '../hooks/use-tags-form'

type TagsActionDialogProps = {
  currentRow?: Tag
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (result: Tag) => void
}

export function TagsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: TagsActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = useTagsForm({
    currentRow,
    onSuccess,
  })

  const hasPermission = useHasPermission(
    isEdit ? PERMISSION_KEY.SETTINGS_TAG_EDIT : PERMISSION_KEY.SETTINGS_TAG_ADD
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Update Tag' : 'Tambah Tag'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update tag disini.'
              : 'Tambah tag baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              id='tag-form'
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
                    <FormLabel>Nama Tag</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan nama tag...'
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
                    <FormLabel>Deskripsi Tag</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan deskripsi tag...'
                        autoComplete='off'
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
              feature={isEdit ? 'Edit Tag' : 'Tambah Tag'}
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
          <Button type='submit' form='tag-form' disabled={isSubmitting}>
            {isEdit ? 'Update Tag' : 'Tambah Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
