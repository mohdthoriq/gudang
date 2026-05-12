import { useMemo, type ReactNode } from 'react'
import type { Menu, MenuCategory } from '@/types'
import { useComboboxQuery } from '@/hooks/use-combobox-query'
import { ComboboxBase } from '@/components/combobox-base'
import {
  type MenuCategoriesQueryParams,
  useMenuCategoriesQuery,
} from '../../menu-categories/hooks/use-menu-categories-query'
import { PermissionCombobox } from '../../permissions/components/permission-combobox'
import { type MenusQueryParams, useMenusQuery } from '../hooks/use-menus-query'

interface MenusComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  limit?: number
  type?: 'category' | 'permission' | 'menu'
  excludeIds?: string[]
  action?: ReactNode
  contactTypeId?: string
}

export function MenusCombobox({
  type = 'category',
  ...props
}: MenusComboboxProps) {
  if (type === 'permission') {
    return <PermissionCombobox {...props} />
  } else if (type === 'menu') {
    return <MenuCombobox {...props} />
  }
  return <CategoryCombobox {...props} />
}

function MenuCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih parent menu',
  limit = 20,
  action,
}: Omit<MenusComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<Menu, MenusQueryParams>({
    queryHook: useMenusQuery,
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
          <span className='font-medium'>{item?.title} - {item.name}</span>
          <span className='text-muted-foreground text-xs'>
            {item.category?.title}
          </span>
        </div>
      )}
      action={action}
    />
  )
}

function CategoryCombobox({
  value,
  onValueChange,
  placeholder = 'Pilih kategori menu',
  limit = 20,
  action,
}: Omit<MenusComboboxProps, 'type'>) {
  const {
    allItems,
    isLoading,
    isError,
    hasMore,
    refetch,
    loadMore,
    setSearchTerm,
  } = useComboboxQuery<MenuCategory, MenuCategoriesQueryParams>({
    queryHook: useMenuCategoriesQuery,
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
          <span className='text-muted-foreground text-xs'>{item.type}</span>
        </div>
      )}
      action={action}
    />
  )
}
