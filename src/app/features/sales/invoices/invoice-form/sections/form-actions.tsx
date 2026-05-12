import { CheckCircle2Icon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type InvoiceFormActionsProps = {
  isEdit?: boolean
  isSubmitting?: boolean
  errorMessage?: string
}

export function InvoiceFormActions({
  isEdit,
  isSubmitting,
  errorMessage,
}: InvoiceFormActionsProps) {
  return (
    <div className='grid gap-4'>
      {errorMessage && (
        <div>
          <Alert variant='destructive'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className='flex justify-end gap-4'>
        <Button type='button' variant='outline' onClick={() => history.back()}>
          Batal
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Menyimpan...'
            : isEdit
              ? 'Update Invoice'
              : 'Buat Invoice'}
        </Button>
      </div>
    </div>
  )
}
