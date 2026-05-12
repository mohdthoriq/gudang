import { memo } from 'react'
import { type useForm } from 'react-hook-form'
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
import type {
  CreateExpenseFormData,
  UpdateExpenseFormData,
} from '../types/expenses-form.schema'
import { ExpensesFormCombobox } from './expenses-form-combobox'

export const ExpensesItemRow = memo(function ExpensesItemRow({
  index,
  form,
  remove,
  taxes,
}: {
  index: number
  form: ReturnType<
    typeof useForm<CreateExpenseFormData | UpdateExpenseFormData>
  >
  remove: (index: number) => void
  taxes: { data: Tax[] }
}) {
  const { openDialog } = useGlobalDialogStore()

  return (
    <TableRow>
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`expense_items.${index}.account_id`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <ExpensesFormCombobox
                type='account'
                value={field.value}
                isParent={false}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
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
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`expense_items.${index}.description`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormControl>
                <Input {...field} className='h-8 text-sm' />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`expense_items.${index}.tax_id`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <Select
                onValueChange={(value) => {
                  field.onChange(value === 'none' ? undefined : value)
                }}
                value={field.value ?? 'none'}
              >
                <FormControl>
                  <SelectTrigger className='h-8 w-full text-sm font-normal'>
                    <SelectValue placeholder='Pajak' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taxes?.data.length === 0 ? (
                    <div className='text-muted-foreground p-2 text-center text-sm'>
                      Tidak ada data pajak
                    </div>
                  ) : (
                    <>
                      <SelectItem
                        value='none'
                        className='text-muted-foreground text-xs'
                      >
                        ...
                      </SelectItem>
                      {taxes?.data.map((t) => (
                        <SelectItem key={t.id} value={t.id} className='text-xs'>
                          {t.name} ({t.rate}%)
                        </SelectItem>
                      ))}
                    </>
                  )}
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
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`expense_items.${index}.amount`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormControl>
                <InputFieldNumberFormat
                  placeholder='0'
                  value={field.value}
                  onValueChange={field.onChange}
                  prefix='Rp'
                  className='h-8 w-[130px] text-right text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className='px-2 py-2'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='text-destructive h-8 w-8 p-0'
          onClick={() => remove(index)}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  )
})
