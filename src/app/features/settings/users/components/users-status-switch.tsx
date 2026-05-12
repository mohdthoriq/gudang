import type { User } from '@/types'
import { Switch } from '@/components/ui/switch'
import { useUpdateUserStatusMutation } from '../hooks/use-users-mutation'

interface UserStatusSwitchProps {
  user: User
  disabled?: boolean
}

export function UserStatusSwitch({ user, disabled }: UserStatusSwitchProps) {
  const updateStatus = useUpdateUserStatusMutation()
  return (
    <div
      className='flex items-center justify-center px-4'
      onClick={(e) => e.stopPropagation()}
    >
      <Switch
        checked={user.is_active}
        onCheckedChange={(checked) =>
          updateStatus.mutate({ id: user.id, is_active: checked })
        }
        disabled={disabled || updateStatus.isPending}
      />
    </div>
  )
}
