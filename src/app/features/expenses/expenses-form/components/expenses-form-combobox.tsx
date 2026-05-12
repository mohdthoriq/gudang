import { useMemo, type ReactNode } from 'react'
import type { Account } from '@/types'
import type { Contact } from '@/types/domain/contact'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import {
  type AccountQueryParams,
  useAccountsQuery,
} from '@/features/account/hooks/use-account-query'
import {
  type ContactQueryParams,
  useContactsQuery,
} from '@/features/contacts/hooks/use-contacts-query'
import { ComboboxBase } from '../../../../components/combobox-base'

interface ExpensesFormComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  type?: 'contact' | 'account'
  excludeIds?: string[]
  disabled?: boolean
  action?: ReactNode
  isParent?: boolean
  extraParams?: Partial<AccountQueryParams | ContactQueryParams>
}

export function ExpensesFormCombobox({
  type = 'contact',
  ...props
}: ExpensesFormComboboxProps) {
  if (type === 'account') {
    return <AccountCombobox {...props} />
  }
  return <ContactCombobox {...props} />
}

function ContactCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Penerima',
  limit = 20,
  disabled,
  action,
  extraParams,
}: Omit<ExpensesFormComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<
    Contact,
    { page?: number; limit?: number; name?: string }
  >({
    queryHook: useContactsQuery,
    limit,
    extraParams: extraParams,
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
      searchPlaceholder='Cari kontak...'
      items={allItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      disabled={disabled}
      getLabel={(item) => item.name}
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{item.name}</span>
          {item.company?.name && (
            <span className='text-muted-foreground text-xs'>
              {item.company_name}
            </span>
          )}
        </div>
      )}
      action={action}
    />
  )
}

function AccountCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Akun',
  limit = 20,
  disabled,
  action,
  isParent,
  extraParams,
}: Omit<ExpensesFormComboboxProps, 'type'>) {
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
      code_prefix: ['5-500', '6-600', '8-800', '9-900'],
      is_parent: isParent,
      ...extraParams,
    } as AccountQueryParams,
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
      disabled={disabled}
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
