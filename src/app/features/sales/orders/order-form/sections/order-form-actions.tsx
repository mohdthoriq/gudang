import { CheckCircle2Icon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type OrderFormActionsProps = {
  isEdit: boolean
  isSubmitting: boolean
  errorMessage?: string
}

export function OrderFormActions({
  isEdit,
  isSubmitting,
  errorMessage,
}: OrderFormActionsProps) {
  return (
    <div className='flex flex-col gap-4'>
      {errorMessage && (
        <div>
          <Alert variant='destructive'>
            <CheckCircle2Icon className='h-4 w-4' />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className='flex items-center justify-end gap-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() => history.back()}
          disabled={isSubmitting}
        >
          Batalkan
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Menyimpan...'
            : isEdit
              ? 'Simpan Perubahan'
              : 'Buat Sales Order'}
        </Button>
      </div>
    </div>
  )
}
