import { Fragment } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { sidebarData } from './data/sidebar-data'
import { sidebarDataAdmin } from './data/sidebar-data-admin'
import { type NavItem } from './types'

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const {
    auth: { user },
  } = useAuthStore()

  const roleName = user?.role?.name?.toLowerCase()
  const isSuperAdmin =
    roleName === 'superadmin' || roleName === 'super administrator'
  const data = isSuperAdmin ? sidebarDataAdmin : sidebarData

  // Flatten sidebar data to make lookups easier
  const routeMap = new Map<string, string>()
  const parentMap = new Map<string, string>()

  const flattenSidebar = (items: NavItem[], parentTitle?: string) => {
    items.forEach((item) => {
      if (item.url) {
        routeMap.set(item.url, item.title)
        // If this URL is a subpath of a parent segment, we might want to map that segment
        if (parentTitle) {
          const mainSegment = item.url.split('/')[1]
          if (mainSegment && !routeMap.has(`/${mainSegment}`)) {
            parentMap.set(`/${mainSegment}`, parentTitle)
          }
        }
      }
      if (item.items) {
        flattenSidebar(item.items, item.title)
      }
    })
  }

  data.navGroups.forEach((group) => flattenSidebar(group.items))

  // Manual mappings for specific segments that might not be in sidebarData
  const manualMappings: Record<string, string> = {
    'sales': 'Penjualan',
    'purchases': 'Pembelian',
    'product-categories': 'Kategori Produk',
    'balance-sheet': 'Neraca',
    'profit-loss': 'Laba Rugi',
    'company': 'Perusahaan',
    'subscription': 'Langganan',
    'auto-sequencing': 'Penomoran Otomatis',
    'users': 'Pengguna',
    'company-roles': 'Peran Pengguna',
    'profile': 'Profil',
    'units': 'Satuan',
    'taxes': 'Pajak',
    'payment-terms': 'Termin Pembayaran',
    'tags': 'Tag',
    'add': 'Tambah',
    'edit': 'Edit',
    'spend': 'Kirim Dana', 
    'receive': 'Terima Dana',
    'sales-per-product': 'Penjualan per Produk',
    'sales-per-categories': 'Penjualan per Kategori',
  }

  // Clean pathname and split into segments
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '')
  const segments = cleanPath.split('/').filter(Boolean)

  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    const href = path
    const title =
      routeMap.get(href) ||
      routeMap.get(`${href}/`) ||
      parentMap.get(href) ||
      manualMappings[segment] ||
      segment.replace(/-/g, ' ').replace(/%20/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

    return {
      title,
      href,
      // Only clickable if it's in the routeMap (has a specific page)
      isClickable: routeMap.has(href) || routeMap.has(`${href}/`),
    }
  })

  const items = [
    { title: 'Dashboard', href: '/', isClickable: true },
    ...breadcrumbItems,
  ]

  return (
    <Breadcrumb className='bg-header border-b px-4 py-4'>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    <p className='text-md text-foreground font-bold tracking-wide'>
                      {item.title}
                    </p>
                  </BreadcrumbPage>
                ) : !item.isClickable ? (
                  <BreadcrumbPage>
                    <p className='text-muted-foreground tracking-wide'>
                      {item.title}
                    </p>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbPage>
                    <Link
                      to={item.href}
                      className='text-muted-foreground tracking-wide'
                    >
                      {item.title}
                    </Link>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
