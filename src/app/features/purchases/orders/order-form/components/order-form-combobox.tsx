import { useMemo, type ReactNode } from 'react'
import type { Contact } from '@/types/domain/contact'
import type { Product } from '@/types/domain/product'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type ContactQueryParams,
  useContactsQuery,
} from '@/features/contacts/hooks/use-contacts-query'
import {
  type ProductsQueryParams,
  useProductsQuery,
} from '@/features/products/product-list/hooks/use-product-list-query'

interface OrderFormComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  type?: 'contact' | 'product'
  excludeIds?: string[]
  action?: ReactNode
  contactTypeId?: string
}

export function OrderFormCombobox({
  type = 'contact',
  ...props
}: OrderFormComboboxProps) {
  if (type === 'product') {
    return <ProductCombobox {...props} />
  }
  return <ContactCombobox {...props} />
}

function ContactCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Vendor',
  limit = 20,
  action,
  contactTypeId,
}: Omit<OrderFormComboboxProps, 'type'>) {
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
      type_id: contactTypeId,
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
      searchPlaceholder='Cari vendor...'
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

function ProductCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih Produk',
  limit = 20,
  action,
}: Omit<OrderFormComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Product, ProductsQueryParams>({
    queryHook: useProductsQuery,
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
      action={action}
      getLabel={(item) => item.name}
      renderItem={(item) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{item.name}</span>
          <span className='text-muted-foreground text-xs'>
            SKU: {item.sku} • Rp{' '}
            {Number(item.sale_price).toLocaleString('id-ID')}
          </span>
        </div>
      )}
    />
  )
}
