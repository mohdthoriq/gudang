import { format } from 'date-fns'
import { type Expense } from '@/types/domain/expenses'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { ExpensesFormCombobox } from '../../expenses-form/components/expenses-form-combobox'
import { useExpensesPaymentsForm } from '../hooks/use-expenses-payments-form'

interface ExpensesPaymentsCardProps {
  expense: Expense
}

export function ExpensesPaymentsCard({ expense }: ExpensesPaymentsCardProps) {
  const { form, onSubmit, isSubmitting } = useExpensesPaymentsForm({
    expenseId: expense.id,
    defaultAmount: Number(expense.outstanding),
  })

  const { data: tags } = useTagsQuery({ page: 1, limit: 100 })

  if (expense.payment_status === 'paid') return null

  return (
    <Card className='border-border gap-0 shadow-none'>
      <CardHeader className='border-none pb-3'>
        <CardTitle className='text-base font-semibold'>
          Kirim Pembayaran
        </CardTitle>
      </CardHeader>
      <Separator className='' />
      <CardContent className='pt-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3'>
              {/* Amount */}
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Total Pembayaran</FormLabel>
                    <FormControl>
                      <InputFieldNumberFormat
                        value={field.value ?? ''}
                        onValueChange={(value) => field.onChange(value ?? '')}
                        placeholder='0'
                        prefix='Rp'
                        className='h-8 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Payment Date */}
              <FormField
                control={form.control}
                name='payment_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-1'>
                    <FormLabel className='text-xs'>
                      Tanggal Pembayaran
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-8 w-full pl-3 text-left text-sm font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd MMM yyyy')
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className='ml-auto h-3.5 w-3.5 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date()
                            const sixDaysAgo = new Date()
                            sixDaysAgo.setDate(today.getDate() - 6)
                            sixDaysAgo.setHours(0, 0, 0, 0)
                            return date < sixDaysAgo
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Account */}
              <FormField
                control={form.control}
                name='account_id'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Dibayar dari</FormLabel>
                    <ExpensesFormCombobox
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      placeholder='Pilih akun'
                      type='account'
                      extraParams={{ code_prefix: ['1-100'] }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>Tag</FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        options={
                          tags?.data.map((tag) => ({
                            label: tag.name,
                            value: tag.id,
                          })) || []
                        }
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder='Pilih tag'
                        disabled={tags?.data.length === 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Note */}
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className='text-xs'>
                      Referensi
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className='text-muted-foreground ml-1 text-[10px]'>
                              (?)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Catatan internal untuk mempermudah pencarian
                              (opsional)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Referensi pembayaran...'
                        {...field}
                        className='h-8 text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end pt-2'>
              <Button
                type='submit'
                size='sm'
                className='h-8 px-4 text-xs'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Simpan Pembayaran'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
