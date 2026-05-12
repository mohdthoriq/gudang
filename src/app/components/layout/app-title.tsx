import { Link } from '@tanstack/react-router'
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
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='flex w-full items-center justify-center'
          >
            <img
              src={isExpanded ? FullLogo : IconLogo}
              alt='Manajerku'
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
