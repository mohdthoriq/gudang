import { CheckCircle2Icon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type WarehouseFormActionsProps = {
  isEdit: boolean
  isSubmitting: boolean
  errorMessage: string | null
}

export function WarehouseFormActions({
  isEdit,
  isSubmitting,
  errorMessage,
}: WarehouseFormActionsProps) {
  return (
    <div className='flex flex-col gap-4'>
      {errorMessage && (
        <Alert variant='destructive' className='w-full'>
          <CheckCircle2Icon className='h-4 w-4' />
          <AlertTitle>Perhatian!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className='flex justify-end gap-2'>
        <Button 
          type='button' 
          variant='outline' 
          onClick={() => history.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isEdit ? 'Update Data Gudang' : 'Simpan Gudang Baru'}
        </Button>
      </div>
    </div>
  )
}
