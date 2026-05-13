"use client"

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { state, toggleSidebar } = useSidebar()

  // Langsung ambil semua data menu karena tanpa sistem login/permission
  const navGroups = sidebarData.navGroups

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div
          className={cn(
            'flex items-center transition-all duration-200',
            'group-data-[collapsible=icon]:pt-2'
          )}
        >
          <AppTitle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Render menu berdasarkan skema Group, Category, dan Model di Prisma */}
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>

      {state === 'expanded' && (
        <div className='px-4 py-2 text-[11px] items-center justify-center leading-tight text-muted-foreground'>
          <p className='text-center uppercase font-bold tracking-widest'>
            THE MASTER TAILOR
          </p>
          <p className='text-center'>
            &copy; {new Date().getFullYear()} v1.0.0
          </p>
        </div>
      )}

      <SidebarFooter className='border-t'>
        <Button
          variant='ghost'
          onClick={toggleSidebar}
          className='w-full justify-center'
        >
          {state === 'collapsed' ? (
            <ArrowRight className='h-4 w-4' />
          ) : (
            <ArrowLeft className='h-4 w-4' />
          )}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}