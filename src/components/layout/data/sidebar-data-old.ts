import {
  GalleryHorizontalEnd,
  LayoutDashboard,
  Store,
  Warehouse,
  History,
  ArrowLeftRight,
  Settings
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/', // Merujuk ke src/app/page.tsx
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Master Data',
      items: [
        {
          title: 'Katalog',
          icon: Store,
          items: [
            {
              title: 'Group',
              url: '/master/groups', 
              icon: GalleryHorizontalEnd,
            },
            {
              title: 'Kategori',
              url: '/master/categories',
              icon: GalleryHorizontalEnd,
            },
            {
              title: 'Model Baju',
              url: '/master/models', // Sesuai tabel Model di Prisma
              icon: Store,
            },
          ],
        },
        {
          title: 'Stok Varian',
          url: '/inventory/variants', // Sesuai tabel Variant di Prisma
          icon: Warehouse,
        },
      ],
    },
    {
      title: 'Aktivitas',
      items: [
        {
          title: 'Transaksi In/Out',
          url: '/transactions',
          icon: ArrowLeftRight,
        },
        {
          title: 'Riwayat Stok',
          url: '/history', // Sesuai tabel StockHistory di Prisma
          icon: History,
        },
      ],
    },
    {
      title: 'Sistem',
      items: [
        {
          title: 'Pengaturan',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
