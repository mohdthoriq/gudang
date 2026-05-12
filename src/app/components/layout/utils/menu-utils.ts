import * as LucideIcons from 'lucide-react'
import { type Menu } from '@/types/domain/menu'
import { type SidebarData, type NavItem, type NavGroup, type NavCollapsible, type NavLink } from '../types'

/**
 * Maps icon name strings to Lucide icon components.
 * Fallback to HelpCircle if icon not found.
 */
export function getIconComponent(
  iconName: string | null | undefined
): LucideIcons.LucideIcon {
  if (!iconName) return LucideIcons.HelpCircle

  const icons = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>

  // Try to find the icon in LucideIcons (PascalCase)
  let Icon = icons[iconName]
  if (Icon) return Icon

  // Try removing 'Icon' suffix if it exists (e.g. CreditCardIcon -> CreditCard)
  if (iconName.endsWith('Icon')) {
    const withoutSuffix = iconName.slice(0, -4)
    Icon = icons[withoutSuffix]
    if (Icon) return Icon
  }

  // Fallback for common mismatches or lowercase names
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
  const NormalizedIcon = icons[normalizedName]

  return NormalizedIcon || LucideIcons.HelpCircle
}

/**
 * Transforms a list of Menu objects from the API into SidebarData format.
 */
export function transformMenusToSidebarData(menus: Menu[]): SidebarData {
  const groupsMap: Record<string, NavGroup> = {}

  // Sort top-level menus by position
  const sortedMenus = [...menus].sort((a, b) => (a.position || 0) - (b.position || 0))

  sortedMenus.forEach((menu) => {
    // Skip if not active
    if (!menu.is_active) return

    const categoryTitle = menu.category?.title || ''
    
    // Initialize group if it doesn't exist
    if (!groupsMap[categoryTitle]) {
      groupsMap[categoryTitle] = {
        title: categoryTitle,
        items: [],
      }
    }

    // Only process top-level items directly; children are handled within
    // We check both parent object and parent_id because the API might return either
    if (!menu.parent && !menu.parent_id) {
      const navItem = transformMenuToNavItem(menu)
      groupsMap[categoryTitle].items.push(navItem)
    }
  })

  // Sort groups by category position if available
  const navGroups = Object.values(groupsMap)

  // Actually, let's try to find the category position from the menus
  const categoryOrder: Record<string, number> = {}
  menus.forEach((m) => {
    if (m.category) {
      categoryOrder[m.category.title] = m.category.position || 0
    }
  })

  navGroups.sort(
    (a, b) => (categoryOrder[a.title] || 0) - (categoryOrder[b.title] || 0)
  )

  return { navGroups }
}

function transformMenuToNavItem(menu: Menu): NavItem {
  const icon = getIconComponent(menu.icon)
  
  // Sort children by position
  const children = menu.children ? [...menu.children].sort((a, b) => (a.position || 0) - (b.position || 0)) : []
  const activeChildren = children.filter(c => c.is_active)

  if (activeChildren.length > 0) {
    return {
      title: menu.title,
      icon,
      items: activeChildren.map((child) => ({
        title: child.title,
        url: child.url as string,
        icon: getIconComponent(child.icon),
      })),
    } as NavCollapsible
  }

  return {
    title: menu.title,
    url: (menu.url || '/') as string,
    icon,
  } as NavLink
}