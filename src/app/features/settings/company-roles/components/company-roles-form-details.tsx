import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateCompanyRoleSettingsFormData } from '../types/company-roles.schema'

interface CompanyRolesFormDetailsProps {
  form: UseFormReturn<CreateCompanyRoleSettingsFormData>
  isEdit: boolean
}

export function CompanyRolesFormDetails({ form, isEdit }: CompanyRolesFormDetailsProps) {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className="text-base font-medium text-foreground">Detail Peran</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isEdit ? 'Ubah nama dan deskripsi untuk peran ini.' : 'Tentukan nama dan deskripsi untuk peran baru ini.'}
        </p>
      </div>
      
      <div className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nama Peran</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder='e.g., Administrator'
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[12px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Deskripsikan peran ini...'
                  className='min-h-[120px] resize-none'
                  {...field}
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