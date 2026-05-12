import { useMemo, type ReactNode } from 'react'
import type { Warehouse } from '@/types' // Sesuaikan path type Warehouse kamu
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import { useWarehousesQuery, type WarehouseQueryParams } from '../../warehouse-list/hooks/use-warehouses-query'

interface WarehouseComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  action?: ReactNode
}

export function WarehouseCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Gudang',
  limit = 20,
  action,
}: WarehouseComboboxProps) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Warehouse, WarehouseQueryParams>({
    queryHook: useWarehousesQuery,
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
      searchPlaceholder='Cari gudang...'
      items={allItems}
      selectedItem={selectedItem}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasMore}
      onSearch={setSearchTerm}
      onLoadMore={loadMore}
      onRetry={refetch}
      action={action}
      getLabel={(item) => item.name}
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{item.name}</span>
          {item.code && (
            <span className='text-muted-foreground text-xs'>
              Kode: {item.code}
            </span>
          )}
        </div>
      )}
    />
  )
}