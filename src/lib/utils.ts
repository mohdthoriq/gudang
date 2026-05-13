// src/app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Penggabung class Tailwind (Wajib untuk shadcn/ui)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Membuat nomor halaman untuk paginasi (1, 2, 3, ..., 10)
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5;
  const rangeWithDots = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    rangeWithDots.push(1);
    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      rangeWithDots.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      rangeWithDots.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    }
  }

  return rangeWithDots;
}

/**
 * Format angka ke Rupiah
 */
export const formatCurrency = (amount: number, currency?: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format angka ke string dengan pemisah ribuan
 */
export const formatNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null || num === '') return '';
  const val = typeof num === 'string' ? parseFloat(num.replace(/[^\d]/g, '')) : num;
  if (isNaN(val)) return '';
  return new Intl.NumberFormat('id-ID').format(val);
};

// =========================================================================
// UTILITIES KHUSUS GUDANG SERAGAM
// =========================================================================

/**
 * Menentukan label status berdasarkan jumlah stok
 */
export const getStockLabel = (stock: number): string => {
  if (stock <= 0) return 'Habis';
  if (stock <= 10) return 'Menipis'; // Angka 10 bisa disesuaikan dengan batas minimum gudang
  return 'Tersedia';
};

/**
 * Memberikan warna badge status berdasarkan jumlah stok
 */
export const getStockStyles = (stock: number): string => {
  if (stock <= 0) {
    return 'bg-red-50 text-red-700 border border-red-200'; // Merah untuk Habis
  }
  if (stock <= 10) {
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200'; // Kuning untuk Menipis
  }
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200'; // Hijau untuk Tersedia
};

/**
 * Menentukan tipe pergerakan barang (Jika nanti ada fitur riwayat stok In/Out)
 */
export const getMovementLabel = (type: 'IN' | 'OUT' | 'ADJUSTMENT'): string => {
  switch (type) {
    case 'IN':
      return 'Barang Masuk';
    case 'OUT':
      return 'Barang Keluar';
    case 'ADJUSTMENT':
      return 'Penyesuaian Stok';
    default:
      return 'Tidak Diketahui';
  }
};
