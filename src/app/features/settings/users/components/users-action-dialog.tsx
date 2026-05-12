'use client'

import { useEffect } from 'react'
import { type User } from '@/types'
import { CheckCircle2Icon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
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
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useUsersForm } from '../hooks/use-users-form'
import { useResendInviteMutation } from '../hooks/use-users-mutation'
import { RolesCombobox } from './users-role-combobox'

type UsersActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UsersActionDialogProps) {
  const isEdit = !!currentRow

  const { form, onSubmit, isSubmitting, errorMessage } = useUsersForm({
    currentRow,
  })
  const currentUser = useAuthStore((state) => state.auth.user)
  const company = currentUser?.company
  const isSelf = currentRow?.id === currentUser?.user.id

  useEffect(() => {
    if (!isEdit && company?.id) {
      form.setValue('company_id', company.id)
    }
  }, [company?.id, isEdit, form])

  const hasPermission = useHasPermission(PERMISSION_KEY.SETTINGS_USER_ADD)
  const resendInviteMutation = useResendInviteMutation()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
        form.reset()
      }}
    >
      <DialogContent className='flex flex-col sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Peran Pengguna' : 'Invite Pengguna'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ubah peran untuk pengguna ini.'
              : 'Undang pengguna baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                'space-y-4',
                !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
              )}
            >
              {isEdit ? (
                <div className='bg-muted/50 space-y-2 rounded-lg p-3'>
                  <div>
                    <p className='text-muted-foreground text-xs font-medium'>
                      Nama Lengkap
                    </p>
                    <p className='text-sm font-semibold'>
                      {currentRow.full_name}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-xs font-medium'>
                      Email
                    </p>
                    <p className='text-sm font-semibold'>{currentRow.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name='full_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan nama lengkap...'
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
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan email...'
                            autoComplete='off'
                            type='email'
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
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan nomor telepon...'
                            autoComplete='off'
                            {...field}
                            disabled={!hasPermission}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='role_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <FormControl>
                      <RolesCombobox
                        placeholder='Pilih peran...'
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={!hasPermission || isSelf}
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
              feature={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
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
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              if (currentRow?.id) {
                resendInviteMutation.mutate(currentRow.id)
              }
            }}
            disabled={!hasPermission || !isEdit || resendInviteMutation.isPending}
          >
            Kirim Ulang Undangan
          </Button>
          <Button
            type='submit'
            form='user-form'
            disabled={isSubmitting || (isEdit && isSelf)}
          >
            {isEdit ? 'Simpan Perubahan' : 'Undang'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
