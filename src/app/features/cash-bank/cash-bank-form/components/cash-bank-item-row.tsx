import { memo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { Account, Tax } from '@/types'
import { Trash2 } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { CashBankListCombobox } from '../../cash-bank-list/components/cash-bank-list-combobox'

export const CashBankItemRow = memo(function CashBankItemRow({
  index,
  remove,
  taxes,
}: {
  index: number
  remove: (index: number) => void
  taxes: Tax[]
}) {
  const { control } = useFormContext()
  const itemValues = useWatch({
    control,
    name: `items.${index}`,
  })

  const { openDialog } = useGlobalDialogStore()

  const amount = Number(itemValues?.amount) || 0

  return (
    <TableRow>
      {/* Account */}
      <TableCell className='min-w-[200px]'>
        <FormField
          control={control}
          name={`items.${index}.account_id`}
          render={({ field }) => (
            <FormItem>
              <CashBankListCombobox
                type='account'
                value={field.value}
                onValueChange={field.onChange}
                placeholder='Pilih Akun'
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
            </FormItem>
          )}
        />
      </TableCell>

      {/* Description */}
      <TableCell className='min-w-[200px]'>
        <FormField
          control={control}
          name={`items.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Keterangan item...' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>

      {/* Amount */}
      <TableCell className='min-w-[150px]'>
        <FormField
          control={control}
          name={`items.${index}.amount`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputFieldNumberFormat
                  placeholder='0'
                  value={field.value}
                  onValueChange={field.onChange}
                  prefix='Rp'
                  className='text-right'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      {/* Tax */}
      <TableCell className='min-w-[150px]'>
        <FormField
          control={control}
          name={`items.${index}.tax_id`}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Pajak' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taxes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.rate}%)
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <FormShortcutButton
                    title='Tambah Pajak Baru'
                    onClick={() =>
                      openDialog('tax', {
                        onSuccess: (data: Tax) => {
                          if (data?.id) {
                            field.onChange(data.id)
                          }
                        },
                      })
                    }
                  />
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </TableCell>

      {/* Row Total (Display only if needed, but the original designs usually show it) */}
      <TableCell className='text-right font-medium'>
        {amount.toLocaleString()}
      </TableCell>

      {/* Action */}
      <TableCell>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='text-destructive'
          onClick={() => remove(index)}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  )
})
