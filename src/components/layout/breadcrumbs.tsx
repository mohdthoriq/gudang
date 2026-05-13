"use client"

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { sidebarData } from './data/sidebar-data'
import { type NavItem } from './types'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Gunakan data utama karena tanpa sistem role/admin terpisah
  const data = sidebarData

  // Flatten sidebar data untuk memudahkan pencarian nama menu berdasarkan URL
  const routeMap = new Map<string, string>()
  const parentMap = new Map<string, string>()

  const flattenSidebar = (items: NavItem[], parentTitle?: string) => {
    items.forEach((item) => {
      if (item.url) {
        routeMap.set(item.url, item.title)
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

  // Pemetaan manual untuk segmen URL di proyek Gudang Seragam
  const manualMappings: Record<string, string> = {
    'master': 'Master Data',
    'groups': 'Grup',
    'categories': 'Kategori',
    'models': 'Model Baju',
    'inventory': 'Inventaris',
    'variants': 'Stok Varian',
    'transactions': 'Transaksi In/Out',
    'history': 'Riwayat Stok',
    'add': 'Tambah Baru',
    'edit': 'Ubah Data',
  }

  // Bersihkan pathname dan bagi menjadi segmen
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '')
  const segments = cleanPath.split('/').filter(Boolean)

  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    const href = path
    
    // Cari nama judul: 1. Dari sidebar, 2. Dari parent, 3. Dari manual mapping
    const title =
      routeMap.get(href) ||
      routeMap.get(`${href}/`) ||
      parentMap.get(href) ||
      manualMappings[segment] ||
      segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

    return {
      title,
      href,
      // Klik aktif jika URL terdaftar di sidebar (memiliki halaman tujuan)
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
                    <span className='text-md text-foreground font-bold tracking-wide'>
                      {item.title}
                    </span>
                  </BreadcrumbPage>
                ) : !item.isClickable ? (
                  <BreadcrumbPage>
                    <span className='text-muted-foreground tracking-wide'>
                      {item.title}
                    </span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbPage>
                    <Link
                      href={item.href}
                      className='text-muted-foreground hover:text-foreground transition-colors tracking-wide'
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
