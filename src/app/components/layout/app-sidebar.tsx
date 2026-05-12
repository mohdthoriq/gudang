import { useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
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
import { sidebarDataAdmin } from './data/sidebar-data-admin'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { state, toggleSidebar } = useSidebar()
  const {
    auth: { user },
  } = useAuthStore()

  const roleName = user?.role?.name?.toLowerCase()
  const isSuperAdmin =
    roleName === 'superadmin' || roleName === 'super administrator'
  const isAdministrator = roleName === 'administrator'

  const data = isSuperAdmin ? sidebarDataAdmin : sidebarData

  const filteredNavGroups = useMemo(() => {
    if (isSuperAdmin || isAdministrator) {
      return data.navGroups
    }

    const permissions = user?.permissions || []

    return data.navGroups
      .map((group) => ({
        ...group,
        items: group.items
          .map((item) => {
            if (item.items) {
              return {
                ...item,
                items: item.items.filter(
                  (subItem) =>
                    !subItem.permission ||
                    permissions.includes(subItem.permission)
                ),
              }
            }
            return item
          })
          .filter((item) => {
            // If it's a link (no sub-items), check its permission
            if (!item.items) {
              return !item.permission || permissions.includes(item.permission)
            }
            // If it's a collapsible, only show if it has at least one visible sub-item
            return item.items.length > 0
          }),
      }))
      .filter((group) => group.items.length > 0)
  }, [data, user, isAdministrator, isSuperAdmin])

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
        {filteredNavGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      {state === 'expanded' && (
          <div className='px-4 py-2 text-[11px] items-center justify-center leading-tight text-muted-foreground'>
            <p className='text-center'>
              &copy; {new Date().getFullYear()} Manajerku v
              {import.meta.env.APP_VERSION}
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
