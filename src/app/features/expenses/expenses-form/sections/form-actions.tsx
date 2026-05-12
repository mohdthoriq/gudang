import { Button } from '@/components/ui/button'

type ExpensesFormActionsProps = {
  isEdit?: boolean
  isSubmitting?: boolean
}

export function ExpensesFormActions({
  isEdit,
  isSubmitting,
}: ExpensesFormActionsProps) {
  // We can use context here if we want, but props are fine too for simple flags
  // However, we need to handle the back button.

  return (
    <div className='flex justify-end gap-2'>
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='h-8 px-4 text-xs'
        onClick={() => history.back()}
      >
        Batal
      </Button>
      <Button
        type='submit'
        size='sm'
        className='h-8 px-4 text-xs'
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Menyimpan...'
          : isEdit
            ? 'Update Biaya'
            : 'Buat Biaya'}
      </Button>
    </div>
  )
}
