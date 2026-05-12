import { type ReactNode, useMemo } from 'react'
import type { Account } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type AccountQueryParams,
  useAccountsQuery,
} from '../hooks/use-account-query'

interface AccountsComboboxProps {
  value?: string | undefined
  onValueChange?: (value: string | undefined) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
  categoryId?: string
  codePrefixes?: string[]
  isParent?: boolean
  disabled?: boolean
  className?: string
}

export function AccountsCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Akun',
  limit = 20,
  action,
  categoryId,
  codePrefixes,
  isParent,
  disabled,
  className,
}: AccountsComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Account, AccountQueryParams>({
    queryHook: useAccountsQuery,
    limit,
    extraParams: {
      category_id: categoryId,
      code_prefix: codePrefixes,
      is_parent: isParent,
    },
    searchKey: 'search',
  })

  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === value) || null,
    [allItems, value]
  )

  return (
    <ComboboxBase
      value={value || undefined}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder='Cari akun...'
      items={allItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      getLabel={(item) => item.name}
      className={className}
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {item.code} - {item.name}
          </span>
          <span className='text-muted-foreground text-xs'>
            {item.category?.name}
          </span>
        </div>
      )}
      action={action}
      disabled={disabled}
    />
  )
}
