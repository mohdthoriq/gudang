import { type ReactNode, useMemo } from 'react'
import type { AccountCategory } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type AccountCategoryQueryParams,
  useAccountCategoriesQuery,
} from '@/features/admin/account-categories/hooks/use-account-categories-query'

interface AccountCategoryComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
  disabled?: boolean
}

export function AccountCategoryCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Kategori',
  limit = 20,
  action,
  disabled,
}: AccountCategoryComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<AccountCategory, AccountCategoryQueryParams>({
    queryHook: useAccountCategoriesQuery,
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
          <span className='text-muted-foreground text-xs'>
            {item.description}
          </span>
        </div>
      )}
      disabled={disabled}
      action={action}
    />
  )
}
