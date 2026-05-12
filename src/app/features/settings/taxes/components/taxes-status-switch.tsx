import type { Tax } from '@/types'
import { Switch } from '@/components/ui/switch'
import { useUpdateTaxStatusMutation } from '../hooks/use-taxes-mutation'

interface TaxStatusSwitchProps {
  tax: Tax
}

export function TaxStatusSwitch({ tax }: TaxStatusSwitchProps) {
  const updateStatus = useUpdateTaxStatusMutation()
  return (
    <div className='flex items-center justify-center px-4'>
      <Switch
        checked={tax.is_active}
        onCheckedChange={(checked) =>
          updateStatus.mutate({
            id: tax.id,
            is_active: checked,
          })
        }
        disabled={updateStatus.isPending}
      />
    </div>
  )
}
