"use client"

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings } from 'lucide-react'
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

// Helper untuk inisial nama tetap bisa dipertahankan
export const getInitials = (fullName: string): string => {
  const names = fullName.trim().split(' ')
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

export function ProfileDropdown() {
  const router = useRouter()
  
  // Karena tanpa login, kita bisa gunakan data statis atau ambil dari config
  const fullName = "Thoriq" // Nama developer dari User Summary
  const initials = getInitials(fullName)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/admin.png' alt={`@${fullName}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1.5'>
            <p className='text-sm leading-none font-medium'>{fullName}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              Administrator Gudang
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => router.push('/settings')}
        >
          <Settings className='mr-2 h-4 w-4' />
          Pengaturan Sistem
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* Menu logout bisa diarahkan ke halaman landing jika diperlukan */}
        <DropdownMenuItem 
          variant='destructive' 
          onClick={() => router.push('/')}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Keluar Aplikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}