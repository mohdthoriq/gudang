import { type ReactNode, useMemo } from 'react'
import type { ContactType } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type ContactQueryParams,
  useContactTypesQuery,
} from '../hooks/use-contacts-query'

export interface ContactTypeComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
  contactTypeId?: string
  disabled?: boolean
  companyId?: string
}

export function ContactTypeCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Tipe Kontak',
  limit = 20,
  action,
  disabled,
  companyId,
}: ContactTypeComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<ContactType, ContactQueryParams>({
    queryHook: useContactTypesQuery,
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
          {item.description && (
            <span className='text-muted-foreground text-xs'>
              {item.description}
            </span>
          )}
        </div>
      )}
    />
  )
}
