import { useMemo, type ReactNode } from 'react'
import type { Account, Contact } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type AccountQueryParams,
  useAccountsQuery,
} from '@/features/account/hooks/use-account-query'
import {
  type ContactQueryParams,
  useContactsQuery,
} from '@/features/contacts/hooks/use-contacts-query'

interface CashBankListComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  type?: 'contact' | 'account'
  excludeIds?: Set<string>
  action?: ReactNode
  contactTypeId?: string
  disabled?: boolean
  codePrefix?: string[]
}

export function CashBankListCombobox({
  type = 'contact',
  ...props
}: CashBankListComboboxProps) {
  if (type === 'account') {
    return <AccountCombobox {...props} />
  }
  return <ContactCombobox {...props} />
}

function AccountCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Akun',
  limit = 20,
  excludeIds,
  action,
  disabled,
  codePrefix = [],
}: Omit<CashBankListComboboxProps, 'type'>) {
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
      code_prefix: codePrefix,
      is_parent: false,
    },
  })

  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === value) || null,
    [allItems, value]
  )

  const filteredItems = useMemo(() => {
    if (!excludeIds || excludeIds.size === 0) return allItems
    return allItems.filter(
      (item) => !excludeIds.has(item.id) || item.id === value
    )
  }, [allItems, excludeIds, value])

  return (
    <ComboboxBase
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder='Cari akun...'
      items={filteredItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      action={action}
      disabled={disabled}
      getLabel={(item) => item.name}
      renderItem={(item) => (
        <>
          <div className='flex flex-col'>
            <span className='font-medium'>
              {item.code} - {item.name}
            </span>
            <span className='text-muted-foreground text-xs'>
              {item.category.name}
            </span>
          </div>
          <hr />
        </>
      )}
    />
  )
}

export interface ContactComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
  contactTypeId?: string
  disabled?: boolean
  companyId?: string
}

export function ContactCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Kontak',
  limit = 20,
  action,
  disabled,
  companyId,
}: ContactComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Contact, ContactQueryParams>({
    queryHook: useContactsQuery,
    limit,
    extraParams: {
      company_id: companyId,
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
      searchPlaceholder='Cari kontak...'
      items={allItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      action={action}
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
    />
  )
}
