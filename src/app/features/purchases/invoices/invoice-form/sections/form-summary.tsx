import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AccountsCombobox } from '@/features/account/components/account-combobox'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import { useInvoiceTotals } from '../hooks/use-invoice-totals'

export function InvoiceFormSummary() {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })
  const { control, setValue, watch } = useFormContext()
  const totals = useInvoiceTotals(taxes?.data || [])

  const {
    fields: discountFields,
    append: appendDiscount,
    remove: removeDiscount,
  } = useFieldArray({
    control,
    name: 'additional_discounts',
  })

  const {
    fields: feeFields,
    append: appendFee,
    remove: removeFee,
  } = useFieldArray({
    control,
    name: 'transaction_fees',
  })

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: 'deductions',
  })

  return (
    <div className='w-full'>
      <div className='w-full'>
        <div className='hover:bg-muted flex justify-between border-b p-2 py-3 text-sm'>
          <span className='text-muted-foreground'>Sub Total</span>
          <span>{totals.subtotal.toLocaleString()}</span>
        </div>

        {/* Additional Discounts */}
        {discountFields.map((field, index) => {
          const type = watch(`additional_discounts.${index}.type`)
          const amount = watch(`additional_discounts.${index}.amount`) || 0
          return (
            <div
              key={field.id}
              className='hover:bg-muted flex items-center justify-between border-b p-2 text-sm'
            >
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='hover:text-destructive h-6 w-6 text-red-500'
                  onClick={() => removeDiscount(index)}
                >
                  <MinusCircle className='size-4' />
                </Button>
                <span className='text-muted-foreground font-medium'>
                  Tambahan Diskon
                </span>
                <div className='flex items-center overflow-hidden rounded-md border'>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(
                        `additional_discounts.${index}.type`,
                        UnitsType.percent
                      )
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.percent
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    %
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(
                        `additional_discounts.${index}.type`,
                        UnitsType.fixed
                      )
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.fixed
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    Rp
                  </button>
                </div>
                <Input
                  {...control.register(`additional_discounts.${index}.value`, {
                    valueAsNumber: true,
                  })}
                  type='number'
                  className='w-20 bg-transparent px-2 focus:outline-none'
                  placeholder='0'
                  startAdornment={type === UnitsType.fixed ? 'Rp' : '%'}
                />
              </div>
              <span>({amount.toLocaleString()})</span>
            </div>
          )
        })}

        <div
          className='hover:bg-muted flex cursor-pointer items-center justify-end gap-2 border-b p-2'
          onClick={() =>
            appendDiscount({
              type: UnitsType.percent,
              value: 0,
              amount: 0,
            })
          }
        >
          <Plus className='text-primary size-3' />
          <span className='text-primary text-sm'>Tambahan Diskon</span>
        </div>

        <div className='flex flex-col'>
          {Object.entries(totals.taxBreakdown).map(([name, amount]) => (
            <div
              key={name}
              className='hover:bg-muted flex justify-between border-b p-2 py-3 text-sm'
            >
              <span className='text-muted-foreground'>{name}</span>
              <span>{amount.toLocaleString()}</span>
            </div>
          ))}
          {Object.keys(totals.taxBreakdown).length === 0 && (
            <div className='hover:bg-muted flex justify-between border-b p-2 py-3 text-sm'>
              <span className='text-muted-foreground'>Total Pajak</span>
              <span>{totals.taxTotal.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Transaction Fees */}
        {feeFields.map((field, index) => {
          const type = watch(`transaction_fees.${index}.type`)
          const amount = watch(`transaction_fees.${index}.amount`) || 0
          return (
            <div
              key={field.id}
              className='hover:bg-muted flex items-center justify-between border-b p-2 text-sm'
            >
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='hover:text-destructive h-6 w-6 text-red-500'
                  onClick={() => removeFee(index)}
                >
                  <MinusCircle className='size-4' />
                </Button>
                <Input
                  {...control.register(`transaction_fees.${index}.name`)}
                  placeholder='Nama...'
                  className='w-40 bg-transparent px-2 focus:outline-none'
                />
                <div className='flex items-center overflow-hidden rounded-md border'>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(
                        `transaction_fees.${index}.type`,
                        UnitsType.percent
                      )
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.percent
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    %
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(
                        `transaction_fees.${index}.type`,
                        UnitsType.fixed
                      )
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.fixed
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    Rp
                  </button>
                </div>
                <Input
                  {...control.register(`transaction_fees.${index}.value`, {
                    valueAsNumber: true,
                  })}
                  type='number'
                  className='w-20 bg-transparent px-2 focus:outline-none'
                  placeholder='0'
                  startAdornment={type === UnitsType.fixed ? 'Rp' : '%'}
                />
              </div>
              <span>({amount.toLocaleString()})</span>
            </div>
          )
        })}
        <div
          className='hover:bg-muted flex cursor-pointer items-center justify-end gap-2 border-b p-2'
          onClick={() =>
            appendFee({
              name: '',
              type: UnitsType.fixed,
              value: 0,
              amount: 0,
            })
          }
        >
          <Plus className='text-primary size-3' />
          <span className='text-primary text-sm'>Biaya Transaksi</span>
        </div>

        {/* Shipping Fee */}
        {Number(watch('shipping_fee') || 0) > 0 && (
          <div className='hover:bg-muted flex justify-between border-b p-2 py-3 text-sm'>
            <span className='text-muted-foreground'>Biaya Pengiriman</span>
            <span>{Number(watch('shipping_fee')).toLocaleString()}</span>
          </div>
        )}

        <div className='text-md hover:bg-muted flex justify-between border-b p-2 py-3 font-semibold'>
          <span>Total</span>
          <span>{totals.totalBeforeDeductions.toLocaleString()}</span>
        </div>

        {/* Deductions */}
        {deductionFields.map((field, index) => {
          const amount = watch(`deductions.${index}.amount`) || 0
          const type = watch(`deductions.${index}.type`)

          return (
            <div
              key={field.id}
              className='hover:bg-muted flex items-center justify-between border-b p-2 text-sm'
            >
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='hover:text-destructive h-6 w-6 text-red-500'
                  onClick={() => removeDeduction(index)}
                >
                  <MinusCircle className='size-4' />
                </Button>
                <FormField
                  control={control}
                  name={`deductions.${index}.account_id`}
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <AccountsCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Dipotong dari...'
                        className='w-40'
                        isParent={false}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex items-center overflow-hidden rounded-md border'>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(`deductions.${index}.type`, UnitsType.percent)
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.percent
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    %
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setValue(`deductions.${index}.type`, UnitsType.fixed)
                    }
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      type === UnitsType.fixed
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    Rp
                  </button>
                </div>
                <Input
                  {...control.register(`deductions.${index}.value`, {
                    valueAsNumber: true,
                  })}
                  type='number'
                  className='w-20 bg-transparent px-2 focus:outline-none'
                  placeholder='0'
                  startAdornment={type === UnitsType.fixed ? 'Rp' : '%'}
                />
              </div>
              <span>({amount.toLocaleString()})</span>
            </div>
          )
        })}
        <div
          className='hover:bg-muted flex cursor-pointer items-center justify-end gap-2 border-b p-2'
          onClick={() =>
            appendDeduction({
              account_id: '',
              type: UnitsType.fixed,
              value: 0,
              amount: 0,
            })
          }
        >
          <Plus className='text-primary size-3' />
          <span className='text-primary text-sm'>Pemotongan</span>
        </div>

        <div className='hover:bg-muted flex justify-between border-b p-2 py-4 text-lg font-bold'>
          <span className='text-foreground'>Total Tagihan</span>
          <span className='text-primary'>{totals.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
