import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { InvoiceItemsTable } from '../components/invoice-items-table'
import type { CreateInvoiceFormData } from '../types/invoice-form.schema'

export function InvoiceFormItems() {
  const [itemsAmount, setItemsAmount] = useState(1)

  const form = useFormContext<CreateInvoiceFormData>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'purchase_invoice_items',
  })

  const handleAddItems = () => {
    const amount = itemsAmount > 0 ? itemsAmount : 1
    const newItems = Array.from({ length: amount }).map(() => ({
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      tax_id: '',
      discount: undefined,
      line_total: 0,
    }))
    append(newItems)
  }

  return (
    <div className='flex flex-col space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <h3 className='text-md font-medium'>Item Tagihan</h3>
          <span className='bg-secondary text-muted-foreground flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[10px] font-medium'>
            {fields.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <FormField
            control={form.control}
            name='is_tax_inclusive'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center space-x-3 rounded-md border p-2'>
                <FormLabel className='text-xs'>Harga termasuk pajak</FormLabel>
                <FormControl>
                  <Switch
                    className='h-5 w-8'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <InvoiceItemsTable fields={fields} remove={remove} form={form} />

      <div className='flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8'
          onClick={handleAddItems}
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah{' '}
          {itemsAmount > 1 ? `${itemsAmount} Item` : 'Item'}
        </Button>
        <Input
          type='number'
          min={1}
          max={100}
          value={itemsAmount}
          onChange={(e) => setItemsAmount(e.target.valueAsNumber)}
          className='h-8 w-16 text-sm'
        />
      </div>
    </div>
  )
}
