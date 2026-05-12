import type {
  FinanceNumber,
  FinanceNumberCodes,
} from '@/types/domain/auto-numbering'
import { CheckCircle2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useAutoNumberingForm } from '../hooks/use-auto-numbering-form'

interface AutoSequencingModalProps {
  item: FinanceNumber | null
  codes: FinanceNumberCodes[]
  isOpen: boolean
  onClose: () => void
}

export function AutoSequencingModal({
  item,
  codes,
  isOpen,
  onClose,
}: AutoSequencingModalProps) {
  const {
    form,
    exampleOutput,
    handleAddCode,
    onSubmit,
    isPreviewLoading,
    errorMessage,
  } = useAutoNumberingForm({ item, onSuccess: onClose })

  const hasPermission = useHasPermission(
    PERMISSION_KEY.SETTINGS_AUTO_SEQUENCING_EDIT
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{item?.title}</DialogTitle>
        </DialogHeader>

        <div className={cn('py-4', !hasPermission && 'relative')}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                'space-y-6',
                !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
              )}
            >
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='col-span-1 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='format_only'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='required-field'>
                          Format Nomor
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!hasPermission} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1 flex items-end'>
                  <Select
                    onValueChange={handleAddCode}
                    disabled={!hasPermission}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Numbering Code' />
                    </SelectTrigger>
                    <SelectContent>
                      {codes.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <FormLabel>Contoh Output Nomor Otomatis</FormLabel>
                <div className='text-muted-foreground text-sm font-medium'>
                  {isPreviewLoading ? (
                    <span className='animate-pulse'>Generating preview...</span>
                  ) : (
                    exampleOutput || '-'
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name='sequence'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='required-field'>
                      Nomor Sekarang
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : ''
                          )
                        }
                        disabled={!hasPermission}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reset_every'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='required-field mb-2'>
                      Reset Nomor Setiap
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                        className='flex flex-col space-y-1'
                        disabled={!hasPermission}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='0' id='r0' />
                          <label htmlFor='r0'>Never reset</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='1' id='r1' />
                          <label htmlFor='r1'>Every month</label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='2' id='r2' />
                          <label htmlFor='r2'>Every year</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <Alert variant='destructive' className='w-full'>
                  <CheckCircle2Icon />
                  <AlertTitle>Perhatian!</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type='button' variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button type='submit' disabled={!hasPermission}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
          {!hasPermission && (
            <UpgradePlanCard type='dialog' feature='Edit Penomoran Otomatis' />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
