import { useFormContext, useWatch } from 'react-hook-form'
import { FinanceNumberType, type Contact, type Tag } from '@/types'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/forms/date-picker'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import type { CashBankFormEditData } from '../types/cash-bank-form.schema'
import { CashBankListCombobox } from '../../cash-bank-list/components/cash-bank-list-combobox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCheckFinanceNumberQuery } from '@/hooks/use-auto-numbering'
import { useDebounce } from '@/hooks/use-debounce'

export function CashBankFormHeader({
  type,
  currentRow,
}: {
  type: 'spend' | 'receive'
  currentRow?: CashBankFormEditData
}) {
  const { control } = useFormContext()
  const { openDialog } = useGlobalDialogStore()
  const { data: tags } = useTagsQuery()

  const transactionNumber = useWatch({ control, name: 'transaction_number' })
  const debouncedTransactionNumber = useDebounce(transactionNumber, 500)

  const isOriginalNumber =
    !!debouncedTransactionNumber &&
    debouncedTransactionNumber === (currentRow?.transaction_number ?? '')

  const {
    data: checkResult,
    isFetching: isCheckingNumber,
    isError: hasCheckError,
  } = useCheckFinanceNumberQuery({
    type: FinanceNumberType.bank_transaction,
    number: debouncedTransactionNumber,
  })

  const numberIsTaken =
    !isOriginalNumber &&
    checkResult &&
    (checkResult.exists === true || checkResult.available === false)

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {/* Transaction Number */}
      <FormField
        control={control}
        name='transaction_number'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Transaksi</FormLabel>
            <FormControl>
              <div className='relative'>
                <Input placeholder='Contoh: TRF-001' {...field} />
                {isCheckingNumber && (
                  <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  </div>
                )}
              </div>
            </FormControl>
            {numberIsTaken || hasCheckError ? (
              <p className='text-[0.8rem] font-medium text-destructive'>
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
      {/* Contact */}
      <FormField
        control={control}
        name='contact_id'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{type === 'spend' ? 'Penerima' : 'Pembayar'}</FormLabel>
            <FormControl>
              <CashBankListCombobox
                type='contact'
                value={field.value || ''}
                onValueChange={field.onChange}
                placeholder='Pilih kontak'
                action={
                  <FormShortcutButton
                    title='Tambah Kontak Baru'
                    onClick={() =>
                      openDialog('contact', {
                        onSuccess: (data: Contact) => {
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
      {/* Date */}
      <FormField
        control={control}
        name='date'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal Transaksi</FormLabel>
            <FormControl>
              <DatePicker
                selected={field.value}
                onSelect={(value) => field.onChange(value)}
                placeholder='Pilih tanggal'
                className='w-full'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reference */}
      <FormField
        control={control}
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
                      Catatan internal untuk mempermudah pencarian (opsional)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input placeholder='Contoh: REF001' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
                disabled={tags?.data.length === 0}
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
  )
}
