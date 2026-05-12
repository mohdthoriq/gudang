import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import type { ApiResponse } from '@/types/api/response'
import type { CategorySalesReportResponse } from '@/types/domain/sales-per-categories'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface SalesPerCategoryQueryParams {
  date_from?: Date
  date_to?: Date
  search?: string
  product_category_id?: string
  page?: number
  limit?: number
}

export function useSalesPerCategoryQuery(params: SalesPerCategoryQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEY.REPORTS_SALES_CATEGORY, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CategorySalesReportResponse>>(
        '/reports/sales/per-category',
        {
          params,
        }
      )
      // return response.data.data.data
      return response.data.data?.data
    },
    enabled: !!(params.date_from && params.date_to),
  })
}

export function useSalesPerCategoryExport(params: SalesPerCategoryQueryParams) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = async () => {
    if (!params.date_from || !params.date_to) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu.')
      return
    }

    setIsExporting(true)

    try {
      const response = await apiClient.get(
        '/reports/sales/per-category/export',
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
      link.download = `laporan-penjualan-per-kategori-${format(params.date_from, 'yyyy-MM-dd')}_${format(params.date_to, 'yyyy-MM-dd')}.xlsx`
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

  return { exportToExcel, isExporting }
}
