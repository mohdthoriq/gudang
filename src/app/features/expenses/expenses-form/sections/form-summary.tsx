import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, MinusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AccountsCombobox } from '@/features/account/components/account-combobox'
import { UnitsType } from '@/features/sales/invoices/invoice-form/types/invoice-form.schema'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import { useExpensesTotals } from '../hooks/use-expenses-totals'
import type { ExpenseFormData } from '../types/expenses-form.schema'

export function ExpensesFormSummary() {
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })
  const { control, setValue, watch } = useFormContext<ExpenseFormData>()
  const totals = useExpensesTotals(taxes?.data || [])

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

        <div className='text-lg hover:bg-muted flex justify-between border-b p-2 py-4 font-bold'>
          <span className='text-foreground'>Total Tagihan</span>
          <span className='text-primary'>{totals.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
