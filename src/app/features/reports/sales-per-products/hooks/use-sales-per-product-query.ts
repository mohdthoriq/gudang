import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '@/types/api/response'
import type { ProductSalesReportResponse } from '@/types/domain/sales-per-products'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface SalesPerProductQueryParams {
  date_from?: Date
  date_to?: Date
  search?: string
  product_category_id?: string | string[]
  page?: number
  limit?: number
}

export function useSalesPerProductQuery(params: SalesPerProductQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.REPORTS_SALES_PRODUCT, params],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<ProductSalesReportResponse>
      >('/reports/sales/per-product', {
        params,
      })
      // Based on provided JSON: response.data.data.data is where items/pagination/summary are
      return response?.data?.data?.data
    },
    enabled: !!(params.date_from && params.date_to),
  })
}

export function useSalesPerProductExport(params: SalesPerProductQueryParams) {
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const exportToExcel = async () => {
    if (!params.date_from || !params.date_to) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu.')
      return
    }

    setIsExporting(true)

    try {
      const response = await apiClient.get(
        '/reports/sales/per-product/export',
        {
          params: {
            date_from: format(params.date_from, 'yyyy-MM-dd'),
            date_to: format(params.date_to, 'yyyy-MM-dd'),
            search: params.search,
            product_category_id: params.product_category_id,
            page: params.page,
            limit: params.limit,
          },
          responseType: 'blob',
        }
      )

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan-penjualan-per-produk-${format(params.date_from, 'yyyy-MM-dd')}_${format(params.date_to, 'yyyy-MM-dd')}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Berhasil mengunduh laporan.')
    } catch {
      toast.error('Gagal mengunduh laporan. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPdf = async () => {
    if (!params.date_from || !params.date_to) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu.')
      return
    }

    setIsExportingPdf(true)

    try {
      const response = await apiClient.get('/reports/sales/per-product/print', {
        params: {
          date_from: format(params.date_from, 'yyyy-MM-dd'),
          date_to: format(params.date_to, 'yyyy-MM-dd'),
          search: params.search,
          product_category_id: params.product_category_id,
          page: params.page,
          limit: params.limit,
        },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan-penjualan-per-produk-${format(params.date_from, 'yyyy-MM-dd')}_${format(params.date_to, 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Berhasil mengunduh laporan PDF.')
    } catch {
      toast.error('Gagal mengunduh laporan PDF. Silakan coba lagi.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return { exportToExcel, isExporting, exportToPdf, isExportingPdf }
}
