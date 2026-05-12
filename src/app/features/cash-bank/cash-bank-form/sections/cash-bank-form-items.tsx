import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CashBankItemsTable } from '../components/cash-bank-items-table'
import type { CashBankFormFormData } from '../types/cash-bank-form.schema'

export function CashBankFormItems() {
  const [itemsAmount, setItemsAmount] = useState(1)
  const form = useFormContext<CashBankFormFormData>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const handleAddItems = () => {
    const amount = itemsAmount > 0 ? itemsAmount : 1
    const newItems = Array.from({ length: amount }).map(() => ({
      account_id: '',
      description: '',
      amount: 0,
      tax_id: null,
    }))
    append(newItems)
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Rincian Transaksi</h3>
        <Badge
          variant='outline'
          className='text-muted-foreground bg-secondary text-sm capitalize'
        >
          Total: {fields.length}
        </Badge>
      </div>

      <CashBankItemsTable fields={fields} remove={remove} />

      <div className='flex w-full items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleAddItems}
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah{' '}
          {itemsAmount > 1 ? `${itemsAmount} Baris` : 'Baris'}
        </Button>
        <Input
          type='number'
          min={1}
          max={100}
          value={itemsAmount}
          onChange={(e) => setItemsAmount(e.target.valueAsNumber || 1)}
          className='w-16 text-sm'
        />
        <div className='ml-auto'>
          <FormField
            control={form.control}
            name='include_tax'
            render={({ field }) => (
              <FormItem className='flex items-center gap-4'>
                <FormLabel>Termasuk Pajak</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
