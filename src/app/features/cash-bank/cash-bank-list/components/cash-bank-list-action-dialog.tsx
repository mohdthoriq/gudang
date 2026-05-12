'use client'

import { useMemo } from 'react'
import {
  FinanceNumberType,
  type Account,
  type CashBankTransactionDetail,
  type Tag,
} from '@/types'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import {
  useCheckFinanceNumberQuery,
  useDefaultNumberingQuery,
} from '@/hooks/use-auto-numbering'
import { useDebounce } from '@/hooks/use-debounce'
import { useHasPermission } from '@/hooks/use-has-permission'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DatePicker } from '@/components/forms/date-picker'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { useCashBankListForm } from '../hooks/use-cash-bank-list-form'
import { CashBankListCombobox } from './cash-bank-list-combobox'

type CashBankListActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CashBankTransactionDetail
  onSuccess?: () => void
}

export function CashBankListActionDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: CashBankListActionDialogProps) {
  const { data: autoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.bank_transfer,
    enabled: true,
  })

  const formData = useMemo(() => {
    if (!currentRow) return undefined

    return {
      id: currentRow?.id,
      from_account_id: currentRow?.account?.id || '',
      to_account_id: currentRow?.items[0]?.account?.id || '',
      transaction_number: currentRow?.reference?.number || '',
      tags:
        currentRow?.tags?.map((tag) =>
          typeof tag === 'object' ? tag.id : tag
        ) || [],
      amount: currentRow?.items[0]?.amount || 0,
      date: currentRow?.trans_date
        ? new Date(currentRow.trans_date)
        : new Date(),
      note: currentRow?.note || '',
    }
  }, [currentRow])

  const { form, onSubmit, isSubmitting } = useCashBankListForm(
    formData,
    autoNumbering,
    onSuccess
  )
  const { data: tags } = useTagsQuery()
  const { openDialog } = useGlobalDialogStore()

  const hasPermission = useHasPermission(PERMISSION_KEY.CASH_BANK_TRANSFER)

  const isEdit = !!currentRow

  const currentFromAccountId = form.watch('from_account_id')
  const currentToAccountId = form.watch('to_account_id')
  const transactionNumber = form.watch('transaction_number')
  const debouncedTransactionNumber = useDebounce(transactionNumber, 500)

  const isOriginalNumber =
    !!debouncedTransactionNumber &&
    debouncedTransactionNumber === (currentRow?.reference?.number ?? '')

  const {
    data: checkResult,
    isFetching: isCheckingNumber,
    isError: hasCheckError,
  } = useCheckFinanceNumberQuery({
    type: FinanceNumberType.bank_transfer,
    number: debouncedTransactionNumber,
  })

  const numberIsTaken =
    !isOriginalNumber &&
    checkResult &&
    (checkResult.exists === true || checkResult.available === false)

  // Combobox "Dari Akun" hanya mengecualikan akun yang dipilih di "Ke Akun"
  const excludeFromIds = useMemo(() => {
    const ids = new Set<string>()
    if (currentToAccountId) {
      ids.add(currentToAccountId)
    }
    return ids
  }, [currentToAccountId])

  // Combobox "Ke Akun" hanya mengecualikan akun yang dipilih di "Dari Akun"
  const excludeToIds = useMemo(() => {
    const ids = new Set<string>()
    if (currentFromAccountId) {
      ids.add(currentFromAccountId)
    }
    return ids
  }, [currentFromAccountId])

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
          <DialogTitle>
            {isEdit ? 'Ubah Transfer Dana' : 'Transfer Dana'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Ubah rincian transfer dana antar akun kas dan bank Anda.'
              : 'Transfer dana antar akun kas dan bank Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className={cn(!hasPermission && 'relative')}>
          <ScrollArea
            className={cn(!hasPermission && 'pointer-events-none blur-[2px]')}
          >
            <Form {...form}>
              <form
                id='transfer-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid grid-cols-1 gap-4 p-2 md:grid-cols-2'
              >
                <div className='col-span-1 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='from_account_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dari Akun</FormLabel>
                        <FormControl>
                          <CashBankListCombobox
                            type='account'
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                            }}
                            placeholder='Pilih akun asal'
                            excludeIds={excludeFromIds}
                            disabled={!hasPermission}
                            codePrefix={['1-100']}
                            action={
                              <FormShortcutButton
                                title='Tambah Akun Baru'
                                onClick={() =>
                                  openDialog('account', {
                                    onSuccess: (data: Account) => {
                                      if (data?.id) {
                                        field.onChange(data.id)
                                      }
                                    },
                                  })
                                }
                              />
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='to_account_id'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ke Akun</FormLabel>
                        <FormControl>
                          <CashBankListCombobox
                            type='account'
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder='Pilih akun tujuan'
                            excludeIds={excludeToIds}
                            disabled={!hasPermission}
                            codePrefix={['1-100']}
                            action={
                              <FormShortcutButton
                                title='Tambah Akun Baru'
                                onClick={() =>
                                  openDialog('account', {
                                    onSuccess: (data: Account) => {
                                      if (data?.id) {
                                        field.onChange(data.id)
                                      }
                                    },
                                  })
                                }
                              />
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            options={
                              tags?.data.map((tag) => ({
                                label: tag.name,
                                value: tag.id,
                              })) || []
                            }
                            selected={field.value || []}
                            onChange={field.onChange}
                            placeholder='Pilih tag'
                            disabled={!hasPermission || tags?.data.length === 0}
                            action={
                              <FormShortcutButton
                                title='Tambah Tag Baru'
                                onClick={() =>
                                  openDialog('tag', {
                                    onSuccess: (data: Tag) => {
                                      if (data?.id) {
                                        field.onChange(data.id)
                                      }
                                    },
                                  })
                                }
                              />
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            onSelect={(value) => {
                              field.onChange(value)
                            }}
                            className='w-full'
                            placeholder='Pilih tanggal transfer'
                            disabled={!hasPermission}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                          <InputFieldNumberFormat
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder='0'
                            prefix='Rp'
                            disabled={!hasPermission}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='transaction_number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Transaksi</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              placeholder='Contoh: TRF-001'
                              {...field}
                              disabled={!hasPermission}
                            />
                            {isCheckingNumber && (
                              <div className='absolute top-1/2 right-2 -translate-y-1/2'>
                                <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {numberIsTaken || hasCheckError ? (
                          <p className='text-destructive text-[0.8rem] font-medium'>
                            {checkResult?.message ||
                              (hasCheckError
                                ? 'Gagal memeriksa nomor transaksi'
                                : 'Nomor transaksi sudah digunakan')}
                          </p>
                        ) : (
                          <FormMessage />
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-1 md:col-span-1'>
                  <FormField
                    control={form.control}
                    name='note'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs'>
                          Referensi
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className='text-muted-foreground ml-1 text-[10px]'>
                                  (?)
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Catatan internal untuk mempermudah pencarian
                                  (opsional)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan referensi transfer...'
                            {...field}
                            disabled={!hasPermission}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div></div>
              </form>
            </Form>
          </ScrollArea>
          {!hasPermission && <UpgradePlanCard feature='Transfer Dana' />}
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='transfer-form'
            disabled={isSubmitting || !hasPermission}
          >
            {'Transfer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
