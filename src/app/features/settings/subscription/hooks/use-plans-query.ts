import { useQuery } from '@tanstack/react-query'
import type { Plan } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

// Re-defining this locally or importing if it was in a shared type file
// Assuming PaginationApiResponse is standard
interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

interface PaginationApiResponse<T> {
  status: string
  code: number
  message: string
  data: T[]
  pagination: PaginationMeta
}

export function usePlansQuery() {
  return useQuery({
    queryKey: [QUERY_KEY_ADMIN.PLANS],
    queryFn: async () => {
      // Fetch only active plans for the pricing page
      const response = await apiClient.get<PaginationApiResponse<Plan>>(
        '/subscriptions/plans?is_active=true&limit=100'
      )
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes caching
  })
}
