import { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AccountsCombobox } from '@/features/account/components/account-combobox'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import { useOrderTotals } from '../hooks/use-order-totals'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'

export function OrderFormSummary() {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })
  const { control, setValue, watch } = useFormContext()
  const totals = useOrderTotals(taxes?.data || [])

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

  const [showDP, setShowDP] = useState(!!watch('dp_account_id') || !!watch('dp_value'))

  const dpType = watch('dp_type')

  const handleRemoveDP = () => {
    setValue('dp_value', 0)
    setValue('dp_account_id', '')
    setShowDP(false)
  }

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
                <MinusCircle
                  className='hover:text-destructive size-4 cursor-pointer text-red-500 transition-colors'
                  onClick={() => removeDiscount(index)}
                />
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
                  className='w-20 bg-transparent px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
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
                <MinusCircle
                  className='hover:text-destructive size-4 cursor-pointer text-red-500 transition-colors'
                  onClick={() => removeFee(index)}
                />
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
                  className='w-20 bg-transparent px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
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
          <span>{totals.total.toLocaleString()}</span>
        </div>

        {/* Down Payment Row */}
        {showDP ? (
          <>
            <div className='hover:bg-muted flex items-center justify-between border-b p-2 text-sm'>
              <div className='flex items-center gap-2'>
                <MinusCircle
                  className='hover:text-destructive size-4 cursor-pointer text-red-500 transition-colors'
                  onClick={handleRemoveDP}
                />
                <span className='text-muted-foreground font-medium'>
                  Uang Muka (DP)
                </span>
                <div className='w-48'>
                  <FormField
                    control={control}
                    name='dp_account_id'
                    render={({ field }) => (
                      <FormItem className='space-y-0'>
                        <FormControl>
                          <AccountsCombobox
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder='Bank/Kas...'
                            className='h-8'
                            isParent={false}
                          />
                        </FormControl>
                        <FormMessage className='text-[10px]' />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex items-center overflow-hidden rounded-md border'>
                  <button
                    type='button'
                    onClick={() => setValue('dp_type', 'percent')}
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      dpType === 'percent'
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    %
                  </button>
                  <button
                    type='button'
                    onClick={() => setValue('dp_type', 'fixed')}
                    className={cn(
                      'rounded-md px-2 py-1 text-xs transition-colors',
                      dpType === 'fixed'
                        ? 'text-primary border border-blue-600'
                        : 'text-muted-foreground'
                    )}
                  >
                    Rp
                  </button>
                </div>
                <FormField
                  control={control}
                  name='dp_value'
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          type='number'
                          className={cn(
                            'w-20 bg-transparent px-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                            totals.dpAmount > totals.total && 'border-destructive'
                          )}
                          placeholder='0'
                          startAdornment={dpType === 'fixed' ? 'Rp' : '%'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <span>({totals.dpAmount.toLocaleString()})</span>
            </div>
            {totals.dpAmount > totals.total && (
              <div className='flex justify-start px-2 pb-1'>
                <p className='text-destructive animate-in fade-in slide-in-from-top-1 text-[10px] font-medium'>
                  Uang muka tidak boleh melebihi total
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            className='hover:bg-muted flex cursor-pointer items-center justify-end gap-2 border-b p-2'
            onClick={() => {
              setShowDP(true)
              setValue('dp_type', 'fixed')
            }}
          >
            <Plus className='text-primary size-3' />
            <span className='text-primary text-sm'>Tambah Uang Muka</span>
          </div>
        )}

        <div className='text-lg hover:bg-muted flex justify-between border-b p-2 py-4 font-bold'>
          <span className='text-foreground'>Total Tagihan</span>
          <span className='text-primary'>
            {(totals.total - totals.dpAmount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
