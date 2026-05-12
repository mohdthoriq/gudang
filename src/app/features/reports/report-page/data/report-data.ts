import type { ReportData } from '../types/report-data.types'

export const reportData: ReportData[] = [
  {
    id: 1,
    category: 'Finansial',
    reports: [
      {
        id: 1,
        name: 'Neraca',
        url: '/reports/balance-sheet',
      },
      {
        id: 2,
        name: 'Arus Kas',
        // url: '/reports/cash-flow',
      },
      {
        id: 3,
        name: 'Laba Rugi',
        url: '/reports/profit-loss',
      },
      {
        id: 4,
        name: 'Perubahan Modal',
        // url: '/reports/capital-changes',
      },
    ],
  },
  {
    id: 2,
    category: 'Akuntansi',
    reports: [
      {
        id: 5,
        name: 'Buku Besar',
        // url: '/reports/ledger',
      },
      {
        id: 6,
        name: 'Jurnal',
        // url: '/reports/journal',
      },
      {
        id: 7,
        name: 'Trial Balance',
        // url: '/reports/trial-balance',
      },
    ],
  },
  {
    id: 3,
    category: 'Penjualan',
    reports: [
      {
        id: 8,
        name: 'Penjualan per Produk',
        url: '/reports/sales-per-product',
      },
      {
        id: 9,
        name: 'Penjualan per Kategori Produk',
        url: '/reports/sales-per-categories',
      },
    ],
  },
]
