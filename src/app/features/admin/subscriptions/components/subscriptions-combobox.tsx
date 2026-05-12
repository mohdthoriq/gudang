import { useMemo, type ReactNode } from 'react'
import type { Company, Plan } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type PlansQueryParams,
  usePlansQuery,
} from '../../plans/hooks/use-plans-query'
import {
  type CompaniesQueryParams,
  useCompaniesQuery,
} from '../hooks/use-companies-query'

interface SubscriptionsComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  type?: 'company' | 'plan'
  excludeIds?: string[]
  action?: ReactNode
  contactTypeId?: string
  initialLabel?: string
}

export function SubscriptionsCombobox({
  type = 'company',
  ...props
}: SubscriptionsComboboxProps) {
  if (type === 'plan') {
    return <PlanCombobox {...props} />
  }
  return <CompanyCombobox {...props} />
}

function CompanyCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Perusahaan',
  limit = 20,
  action,
  initialLabel,
}: Omit<SubscriptionsComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Company, CompaniesQueryParams>({
    queryHook: useCompaniesQuery,
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
      searchPlaceholder='Cari kontak...'
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
          {item.address && (
            <span className='text-muted-foreground text-xs'>
              {item.address}
            </span>
          )}
        </div>
      )}
      action={action}
      initialLabel={initialLabel}
    />
  )
}

function PlanCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Plan',
  limit = 20,
  action,
  initialLabel,
}: Omit<SubscriptionsComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Plan, PlansQueryParams>({
    queryHook: usePlansQuery,
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
      searchPlaceholder='Cari produk...'
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
      action={action}
      initialLabel={initialLabel}
    />
  )
}
