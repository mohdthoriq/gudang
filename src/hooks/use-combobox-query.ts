"use client"

import { useEffect, useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { PaginationApiResponse } from '@/types'
import { useDebounce } from '@/hooks/use-debounce'

interface UseComboboxQueryProps<T, P> {
  queryHook: (params: P) => UseQueryResult<PaginationApiResponse<T>, Error>
  limit?: number
  extraParams?: Partial<P>
  searchKey?: string
}

export function useComboboxQuery<T extends { id: string }, P>({
  queryHook,
  limit = 20,
  extraParams = {} as Partial<P>,
}: UseComboboxQueryProps<T, P>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allItems, setAllItems] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const query = queryHook({
    page: currentPage,
    limit,
    search: debouncedSearchTerm || undefined,
    ...extraParams,
  } as unknown as P)

  const { data, isLoading, isError, refetch } = query

  useEffect(() => {
    const debounceManager = () => {
      setCurrentPage(1)
      setAllItems([])
      setHasMore(true)
    }
    debounceManager()
  }, [debouncedSearchTerm])

  useEffect(() => {
    const paginationManager = () => {
      if (data?.data) {
        if (currentPage === 1) {
          setAllItems(data.data)
        } else {
          setAllItems((prev) => {
            const newData = data.data.filter(
              (newItem: T) =>
                !prev.some((existingItem) => existingItem.id === newItem.id)
            )
            return [...prev, ...newData]
          })
        }

        const pagination = data.pagination
        if (pagination) {
          setHasMore(currentPage < pagination.total_pages)
        }
      }
    }
    paginationManager()
  }, [data, currentPage])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
  }
}
