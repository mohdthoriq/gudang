import { useQuery } from '@tanstack/react-query'
import type { Contact, PaginationApiResponse, ContactType } from '@/types'
import apiClient from '@/lib/api-client'
import { QUERY_KEY } from '@/constants/query-key'

export interface ContactQueryParams {
  page?: number
  limit?: number
  company_id?: string
  search?: string
  type_id?: string
}

export function useContactsQuery(params?: ContactQueryParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.CONTACT,
      params?.page,
      params?.limit,
      params?.company_id,
      params?.search,
      params?.type_id,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
        ...(params?.type_id ? { type_id: params.type_id } : {}),
      })

      const url = queryParams.toString()
        ? `/contacts?${queryParams.toString()}`
        : '/contacts'
      const response = await apiClient.get<PaginationApiResponse<Contact>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useContactTypesQuery(params?: ContactQueryParams) {
  return useQuery({
    queryKey: [
      'contact-types',
      params?.page,
      params?.limit,
      params?.company_id,
      params?.search,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.page ? { page: params.page.toString() } : {}),
        ...(params?.limit ? { limit: params.limit.toString() } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.company_id ? { company_id: params.company_id } : {}),
      })

      const url = queryParams.toString()
        ? `/contact-types?${queryParams.toString()}`
        : '/contact-types'
      const response =
        await apiClient.get<PaginationApiResponse<ContactType>>(url)

      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
