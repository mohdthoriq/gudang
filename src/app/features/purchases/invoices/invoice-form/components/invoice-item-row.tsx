import { memo, useEffect } from 'react'
import { useWatch, type useForm } from 'react-hook-form'
import type { Product, Tax } from '@/types'
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
  CreateInvoiceFormData,
  UpdateInvoiceFormData,
} from '../types/invoice-form.schema'
import { InvoiceFormCombobox } from './invoice-form-combobox'

export const InvoiceItemRow = memo(function InvoiceItemRow({
  index,
  form,
  remove,
  products,
  taxes,
}: {
  index: number
  form: ReturnType<
    typeof useForm<CreateInvoiceFormData | UpdateInvoiceFormData>
  >
  remove: (index: number) => void
  products: { data: Product[] }
  taxes: { data: Tax[] }
}) {
  const itemValues = useWatch({
    control: form.control,
    name: `purchase_invoice_items.${index}`,
  })
  const { openDialog } = useGlobalDialogStore()

  const quantity = Number(itemValues?.quantity) || 0
  const unitPrice = Number(itemValues?.unit_price) || 0
  const discount = Number(itemValues?.discount) || 0
  const discountAmount = (quantity * unitPrice * discount) / 100
  const rowTotal = quantity * unitPrice - discountAmount

  // Sync row total to form state whenever it changes
  useEffect(() => {
    const currentTotal = form.getValues(
      `purchase_invoice_items.${index}.line_total`
    )
    if (currentTotal !== rowTotal) {
      form.setValue(`purchase_invoice_items.${index}.line_total`, rowTotal)
    }
  }, [rowTotal, form, index])

  return (
    <TableRow>
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`purchase_invoice_items.${index}.product_id`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <InvoiceFormCombobox
                type='product'
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value) {
                    const product = products.data.find((p) => p.id === value)
                    if (product) {
                      form.setValue(
                        `purchase_invoice_items.${index}.unit_price`,
                        product.purchase_price
                      )
                    }
                  }
                }}
                action={
                  <FormShortcutButton
                    title='Tambah Produk'
                    onClick={() =>
                      openDialog('product', {
                        onSuccess: (data: Product) => {
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
          name={`purchase_invoice_items.${index}.description`}
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
          name={`purchase_invoice_items.${index}.quantity`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className='h-8 w-[80px] text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`purchase_invoice_items.${index}.unit_price`}
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
        <FormField
          control={form.control}
          name={`purchase_invoice_items.${index}.discount`}
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  value={field.value ?? ''}
                  endAdornment={'%'}
                  className='h-8 w-[65px] text-sm'
                  placeholder='0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className='px-2 py-2'>
        <FormField
          control={form.control}
          name={`purchase_invoice_items.${index}.tax_id`}
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
      <TableCell className='px-2 py-2 text-right text-sm font-medium'>
        {rowTotal.toLocaleString()}
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
