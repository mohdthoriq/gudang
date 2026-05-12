import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, MenuCategory } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY_ADMIN } from '@/constants/query-key'

export interface MenuCategoriesQueryParams {
  page?: number
  limit?: number
  name?: string
}

export function useMenuCategoriesQuery(params?: MenuCategoriesQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY_ADMIN.MENU_CATEGORIES,
      params?.page,
      params?.limit,
      params?.name,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.name ? { name: params.name } : {}),
      })

      const url = queryParams.toString()
        ? `/menu-categories?${queryParams.toString()}`
        : '/menu-categories'
      const response =
        await apiClient.get<PaginationApiResponse<MenuCategory>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
