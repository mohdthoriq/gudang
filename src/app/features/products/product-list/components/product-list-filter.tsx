import { useEffect, useState } from 'react'
import { FilterIcon } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { ProductCategoryCombobox } from '@/features/product-categories/components/product-category-combobox'

interface ProductListFilterProps {
  className?: string
  search: Record<string, unknown>
  navigate: (opts: {
    search:
      | true
      | Record<string, unknown>
      | ((
          prev: Record<string, unknown>
        ) => Partial<Record<string, unknown>> | Record<string, unknown>)
    replace?: boolean
  }) => void
}

export function ProductListFilter({
  className,
  search,
  navigate,
}: ProductListFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >()

  const { openDialog } = useGlobalDialogStore()

  useEffect(() => {
    const syncStateFromUrl = () => {
      const categoryId = (search['category_id'] as string) || undefined
      setSelectedCategoryId(categoryId)
    }

    syncStateFromUrl()
  }, [search])

  const handleApply = () => {
    const newParams: Record<string, unknown> = {}

    if (selectedCategoryId) {
      newParams['category_id'] = selectedCategoryId
    } else {
      newParams['category_id'] = undefined
    }

    newParams['page'] = 1

    navigate({
      search: (prev) => ({
        ...prev,
        ...newParams,
      }),
    })
    setOpen(false)
  }

  const handleReset = () => {
    setSelectedCategoryId(undefined)

    navigate({
      search: (prev) => ({
        ...prev,
        category_id: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }

  const activeFilterCount = [selectedCategoryId].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('gap-2', className)}>
          <FilterIcon className='h-4 w-4' />
          Filter
          {activeFilterCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 h-5 rounded-sm px-1 text-[10px]'
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[calc(100vw-2rem)] p-0 md:w-[350px]'
        align='start'
        side='right'
      >
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b px-4 py-2'>
            <h4 className='font-medium'>Filter</h4>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleReset}
              className='text-muted-foreground hover:text-foreground'
            >
              Reset
            </Button>
          </div>
          <div className='p-4 space-y-4'>
            <div className='space-y-2'>
              <label className='text-xs font-medium'>Kategori Produk</label>
              <ProductCategoryCombobox
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                action={
                  <FormShortcutButton
                    title='Tambah Kategori Baru'
                    onClick={() => openDialog('product-category')}
                  />
                }
              />
            </div>
          </div>
          <div className='bg-muted/10 flex justify-end border-t p-4'>
            <Button onClick={handleApply}>Terapkan Filter</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
