import { TransactionCode } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5 // Maximum number of page buttons to show
  const rangeWithDots = []

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i)
    }
  } else {
    // Always show first page
    rangeWithDots.push(1)

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i)
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i)
      }
      rangeWithDots.push('...', totalPages)
    }
  }

  return rangeWithDots
}

export const formatCurrency = (amount: number, currency?: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format number to currency string without symbol
export const formatNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null || num === '') return ''
  const val =
    typeof num === 'string' ? parseFloat(num.replace(/[^\d]/g, '')) : num
  if (isNaN(val)) return ''
  return new Intl.NumberFormat('id-ID').format(val)
}

export const invoiceLabel: Record<string, string> = {
  unpaid: 'Belum Dibayar',
  paid: 'Lunas',
  partially_paid: 'Dibayar Sebagian',
  overdue: 'Terlambat',
  open: 'Terbuka',
}

export const orderLabel: Record<string, string> = {
  draft: 'Draf',
  posted: 'Terkirim',
  void: 'Dibatalkan',
  ...invoiceLabel,
}

export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'paid':
    case 'posted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'partially_paid':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'unpaid':
    case 'void':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'open':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'draft':
      return 'bg-slate-50 text-slate-700 border-slate-200'
    default:
      return ''
  }
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export const getTransactionTitle = (transTypeCode: string | undefined) => {
  switch (transTypeCode) {
    case TransactionCode.SalesInvoice:
      return 'Penerimaan Pembayaran Penjualan'
    case TransactionCode.PurchaseInvoice:
      return 'Pembayaran Pembelian'
    case TransactionCode.Expense:
      return 'Pembayaran Biaya'
    case TransactionCode.BankTransfer:
      return 'Transfer Dana'
    case TransactionCode.SpendMoney:
      return 'Kirim Dana'
    case TransactionCode.ReceiveMoney:
      return 'Terima Dana'
    default:
      return 'Detail Transaksi'
  }
}
