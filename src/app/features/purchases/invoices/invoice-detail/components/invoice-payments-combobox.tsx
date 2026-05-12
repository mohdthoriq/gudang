import { type ReactNode, useMemo } from 'react'
import type { Account } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type AccountQueryParams,
  useAccountsQuery,
} from '@/features/account/hooks/use-account-query'

interface InvoicePaymentsComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
}

export function InvoicePaymentsCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Akun',
  limit = 20,
  action,
}: InvoicePaymentsComboboxProps) {
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
      code_prefix: ['1-100'],
      is_parent: false,
    },
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
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {item.code} - {item.name}
          </span>
          <span className='text-muted-foreground text-xs'>
            {item.category.name}
          </span>
        </div>
      )}
      action={action}
    />
  )
}
