import React from 'react'

/**
 * Properti dasar untuk setiap item navigasi di sidebar.
 */
type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  // Properti permission bisa tetap ada jika di masa depan 
  // Anda ingin menambah sistem role, namun untuk sekarang bisa diabaikan.
  permission?: string 
}

/**
 * Tipe untuk link navigasi tunggal (tanpa sub-menu).
 */
type NavLink = BaseNavItem & {
  url: string // Menggunakan string biasa untuk Next.js href
  items?: never
}

/**
 * Tipe untuk item navigasi yang memiliki sub-menu (dapat dibuka-tutup).
 */
type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

/**
 * Gabungan tipe navigasi yang bisa berupa link tunggal atau grup collapsible.
 */
type NavItem = NavCollapsible | NavLink

/**
 * Representasi satu grup besar di sidebar (misal: "Master Data", "Aktivitas").
 */
type NavGroup = {
  title: string
  items: NavItem[]
}

/**
 * Struktur data lengkap untuk seluruh sidebar.
 */
type SidebarData = {
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
