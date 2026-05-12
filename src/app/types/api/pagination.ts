export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: PaginationMeta
}

export function buildPaginationMeta(params: {
  page: number
  limit: number
  total: number
}): PaginationMeta {
  const { page, limit, total } = params
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return {
    page,
    limit: limit,
    total,
    total_pages: totalPages,
  }
}
