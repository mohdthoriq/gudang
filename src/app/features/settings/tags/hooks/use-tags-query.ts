import { useQuery } from '@tanstack/react-query'
import type { PaginationApiResponse, Tag } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface TagsQueryParams {
  page?: number
  limit?: number
  order?: string
  search?: string
}

export function useTagsQuery(params?: TagsQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.TAGS,
      params?.page,
      params?.limit,
      params?.order,
      params?.search,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.order ? { order: params.order } : {}),
      })

      const url = queryParams.toString()
        ? `/tags?${queryParams.toString()}`
        : '/tags'
      const response = await apiClient.get<PaginationApiResponse<Tag>>(url)

      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // optional: retry once only
  })
}
