import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CreateWarehouseFormData } from '../types/warehouses.schema'

type WarehouseFormHeaderProps = {
  form: UseFormReturn<CreateWarehouseFormData>
  isEdit: boolean
}

export function WarehouseFormHeader({ form, isEdit }: WarehouseFormHeaderProps) {
  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <div className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Gudang</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan nama gudang...' autoComplete='off' {...field} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Gudang</FormLabel>
              <FormControl>
                <Input placeholder='Masukkan kode gudang...' autoComplete='off' {...field} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='space-y-4'>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Catatan atau deskripsi gudang...'
                  className='resize-none h-20'
                  {...field}
                  disabled={isEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
