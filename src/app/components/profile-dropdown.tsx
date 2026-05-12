import { useNavigate } from '@tanstack/react-router'
import { CreditCard, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutDialog } from '@/components/dialog/logout.dialog'

// eslint-disable-next-line
export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ')
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

export function ProfileDropdown() {
  const navigate = useNavigate()
  const [open, setOpen] = useDialogState()
  const user = useAuthStore((state) => state.auth.user)

  // Fallback values if user is not loaded yet
  const fullName = user?.user?.full_name || 'User'
  const email = user?.user?.email || 'user@example.com'
  const companyName = user?.company?.name || 'Company'
  const planName = user?.subscription?.plan_name || 'Paket Gratis Selamanya'
  const initials = getInitials(fullName)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt={`@${fullName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>{fullName}</p>
              <p className='text-muted-foreground text-xs leading-none'>
                {email}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {companyName}
              </p>
              <p className='text-primary mt-2 text-xs leading-none'>
                {planName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='default'
            onClick={() => navigate({ to: '/settings/profile' })}
          >
            <User className='h-4 w-4' />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='default'
            onClick={() => navigate({ to: '/settings/subscription' })}
          >
            <CreditCard className='h-4 w-4' />
            Langganan
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut className='h-4 w-4' />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
