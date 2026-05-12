import { type ReactNode, useMemo } from 'react'
import type { ProductCategory } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type ProductCategoryQueryParams,
  useProductCategoryQuery,
} from '../hooks/use-product-category-query'

interface ProductCategoryComboboxProps {
  value?: string
  onValueChange?: (value: string | undefined) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
  disabled?: boolean
}

export function ProductCategoryCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Kategori',
  limit = 20,
  action,
  disabled,
}: ProductCategoryComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<ProductCategory, ProductCategoryQueryParams>({
    queryHook: useProductCategoryQuery,
    limit,
  })

  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === value) || null,
    [allItems, value]
  )

  return (
    <ComboboxBase
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder='Cari kategori...'
      items={allItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      getLabel={(item) => item.name}
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{item.name}</span>
        </div>
      )}
      disabled={disabled}
      action={action}
    />
  )
}
