import { useState } from 'react'
import { useFieldArray, useFormContext, type UseFormReturn } from 'react-hook-form'
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
import type { CreatePurchasesOrderFormData, PurchasesOrderItemFormData, UpdatePurchasesOrderFormData } from '../types/order-form.schema'
import { OrderItemsTable } from '../components/order-items-table'

export function OrderFormItems() {
  const [itemsAmount, setItemsAmount] = useState(1)

  const form = useFormContext<CreatePurchasesOrderFormData>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'purchase_order_items',
  })

  const handleAddItems = () => {
    const amount = itemsAmount > 0 ? itemsAmount : 1
    const newItems = Array.from({ length: amount }).map(() => ({
      product_id: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      purchase_price: 0,
      tax_id: '',
      discount: 0,
      line_total: 0,
    }))
    append(newItems)
  }

  return (
    <div className='flex flex-col space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <h3 className='text-md font-medium'>Barang Order</h3>
          <span className='bg-secondary text-muted-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-medium border'>
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

      <OrderItemsTable 
        fields={fields as unknown as PurchasesOrderItemFormData[]} 
        remove={remove} 
        form={form as unknown as UseFormReturn<CreatePurchasesOrderFormData | UpdatePurchasesOrderFormData>} 
      />

      <div className='flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleAddItems}
        >
          <Plus className='mr-2 h-4 w-4' /> Tambah{' '}
          {itemsAmount > 1 ? `${itemsAmount} Barang` : 'Barang'}
        </Button>
        <Input
          type='number'
          min={1}
          max={100}
          value={itemsAmount}
          onChange={(e) => setItemsAmount(e.target.valueAsNumber)}
          className='w-16 text-sm'
        />
      </div>
    </div>
  )
}
