"use client" // Tambahkan ini di baris pertama

import Link from 'next/link' // Ganti dari tanstack ke next/link
import IconLogo from '@/assets/manajerku-logo.png' 
import FullLogo from '@/assets/manajerku-office.png'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile, state } = useSidebar()
  const isExpanded = state === 'expanded'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          asChild
          className={cn(
            'transition-all duration-200 hover:bg-transparent active:bg-transparent',
            'h-auto w-full',
            'group-data-[collapsible=icon]:size-auto! group-data-[collapsible=icon]:p-0!'
          )}
        >
          {/* Gunakan href sebagai pengganti to di Next.js */}
          <Link
            href='/' 
            onClick={() => setOpenMobile(false)}
            className='flex w-full items-center justify-center'
          >
            <img
              // Next.js bisa langsung mengolah import gambar ke properti src
              src={isExpanded ? FullLogo.src : IconLogo.src}
              alt='The Master Tailor'
              className={cn(
                'rounded-md object-contain transition-all duration-200 dark:brightness-0 dark:invert',
                isExpanded ? 'h-10 w-full' : 'h-8 w-8 rounded-md'
              )}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}