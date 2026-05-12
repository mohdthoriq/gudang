import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FilterIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { MultiSelectDropdown } from '@/components/forms/multi-select-dropdown'
import { useTagsQuery } from '@/features/settings/tags/hooks/use-tags-query'
import { useUsersQuery } from '@/features/settings/users/hooks/use-users-query'
import { useExpeditionsQuery } from '@/features/settings/expeditions/hooks/use-expeditions-query'
import { usePaymentTermsQuery } from '@/features/settings/payment-terms/hooks/use-payment-terms-query'
import { OrderFormCombobox } from '../../order-form/components/order-form-combobox'
import { DatePickerWithRange } from '@/features/sales/invoices/invoice-lists/components/date-picker-with-range'
import { ProductCategoryCombobox } from '@/features/product-categories/components/product-category-combobox'

interface OrderListFilterProps {
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

export function OrderListFilter({
  className,
  search,
  navigate,
}: OrderListFilterProps) {
  const [open, setOpen] = useState(false)

  // Dates
  const [orderDate, setOrderDate] = useState<DateRange | undefined>()
  const [dueDate, setDueDate] = useState<DateRange | undefined>()
  const [paymentDate, setPaymentDate] = useState<DateRange | undefined>()

  // Selections
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState<string | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>()
  const [selectedTermId, setSelectedTermId] = useState<string | undefined>()
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string | undefined>()
  const [attachmentFilter, setAttachmentFilter] = useState<'all' | 'true' | 'false'>('all')

  const { openDialog } = useGlobalDialogStore()

  // Queries for options
  const { data: tagsData } = useTagsQuery({ limit: 1000 })
  const { data: usersData } = useUsersQuery({ limit: 1000 })
  const { data: expeditionsData } = useExpeditionsQuery({ limit: 1000 })
  const { data: paymentTermsData } = usePaymentTermsQuery({ limit: 1000 })

  const tagOptions = tagsData?.data.map((tag) => ({ label: tag.name, value: tag.id })) ?? []
  const userOptions = usersData?.data.map((user) => ({ label: user.full_name || user.email, value: user.id })) ?? []

  useEffect(() => {
    const syncStateFromUrl = () => {
      const getParam = (key: string) => (search[key] as string) || undefined

      const dateFrom = getParam('date_from')
      const dateTo = getParam('date_to')
      if (dateFrom || dateTo) {
        setOrderDate({
          from: dateFrom ? new Date(dateFrom) : undefined,
          to: dateTo ? new Date(dateTo) : undefined,
        })
      }

      const dueDateFrom = getParam('due_date_from')
      const dueDateTo = getParam('due_date_to')
      if (dueDateFrom || dueDateTo) {
        setDueDate({
          from: dueDateFrom ? new Date(dueDateFrom) : undefined,
          to: dueDateTo ? new Date(dueDateTo) : undefined,
        })
      }

      const payDateFrom = getParam('payment_date_from')
      const payDateTo = getParam('payment_date_to')
      if (payDateFrom || payDateTo) {
        setPaymentDate({
          from: payDateFrom ? new Date(payDateFrom) : undefined,
          to: payDateTo ? new Date(payDateTo) : undefined,
        })
      }

      setSelectedCustomerId(getParam('customer_id'))
      setSelectedTagIds(getParam('tags')?.split(',') || [])
      setSelectedSalesPersonId(getParam('sales_person_id'))
      setSelectedCategoryId(getParam('category_id'))
      setSelectedProductId(getParam('product_id'))
      setSelectedTermId(getParam('payment_term_id'))
      setSelectedExpeditionId(getParam('expedition_id'))
      setAttachmentFilter((getParam('has_attachment') as 'all' | 'true' | 'false') || 'all')
    }

    syncStateFromUrl()
  }, [search])

  const handleApply = () => {
    const newParams: Record<string, unknown> = {}

    const setDateParams = (range: DateRange | undefined, startKey: string, endKey: string) => {
      newParams[startKey] = range?.from ? format(range.from, 'yyyy-MM-dd') : undefined
      newParams[endKey] = range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
    }

    setDateParams(orderDate, 'date_from', 'date_to')
    setDateParams(dueDate, 'due_date_from', 'due_date_to')
    setDateParams(paymentDate, 'payment_date_from', 'payment_date_to')

    newParams['customer_id'] = selectedCustomerId
    newParams['tags'] = selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined
    newParams['sales_person_id'] = selectedSalesPersonId
    newParams['category_id'] = selectedCategoryId
    newParams['product_id'] = selectedProductId
    newParams['payment_term_id'] = selectedTermId
    newParams['expedition_id'] = selectedExpeditionId
    newParams['has_attachment'] = attachmentFilter !== 'all' ? attachmentFilter : undefined

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
    setOrderDate(undefined)
    setDueDate(undefined)
    setPaymentDate(undefined)
    setSelectedCustomerId(undefined)
    setSelectedTagIds([])
    setSelectedSalesPersonId(undefined)
    setSelectedCategoryId(undefined)
    setSelectedProductId(undefined)
    setSelectedTermId(undefined)
    setSelectedExpeditionId(undefined)
    setAttachmentFilter('all')

    navigate({
      search: (prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
        due_date_from: undefined,
        due_date_to: undefined,
        payment_date_from: undefined,
        payment_date_to: undefined,
        customer_id: undefined,
        tags: undefined,
        sales_person_id: undefined,
        category_id: undefined,
        product_id: undefined,
        payment_term_id: undefined,
        expedition_id: undefined,
        has_attachment: undefined,
        page: 1,
      }),
    })
    setOpen(false)
  }

  const activeFilterCount = [
    orderDate,
    dueDate,
    paymentDate,
    selectedCustomerId,
    selectedTagIds.length > 0,
    selectedSalesPersonId,
    selectedCategoryId,
    selectedProductId,
    selectedTermId,
    selectedExpeditionId,
    attachmentFilter !== 'all',
  ].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={cn('gap-2', className)}>
          <FilterIcon className='h-4 w-4' />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant='secondary' className='ml-1 h-5 rounded-sm px-1 text-[10px]'>
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[calc(100vw-2rem)] p-0 md:w-[850px]' align='start' side='right'>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b px-4 py-2'>
            <h4 className='font-medium'>Filter Sales Order</h4>
            <Button variant='ghost' size='sm' onClick={handleReset} className='text-muted-foreground hover:text-foreground'>
              Reset
            </Button>
          </div>
          <div className='grid max-h-[60vh] grid-cols-1 divide-y overflow-y-auto md:grid-cols-3 md:divide-x md:divide-y-0'>
            {/* Col 1: Dates */}
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-xs font-bold uppercase tracking-wider'>Tanggal</h5>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Tanggal Order</label>
                <DatePickerWithRange date={orderDate} setDate={setOrderDate} />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Jatuh Tempo</label>
                <DatePickerWithRange date={dueDate} setDate={setDueDate} />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Tanggal Pembayaran</label>
                <DatePickerWithRange date={paymentDate} setDate={setPaymentDate} />
              </div>
            </div>

            {/* Col 2: Customer & Sales */}
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-xs font-bold uppercase tracking-wider'>Pelanggan & Sales</h5>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Pelanggan</label>
                <OrderFormCombobox
                  type='contact'
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                  placeholder='Pilih Pelanggan'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Tag</label>
                <MultiSelectDropdown
                  options={tagOptions}
                  selected={selectedTagIds}
                  onChange={setSelectedTagIds}
                  placeholder='Pilih tag'
                  action={<FormShortcutButton title='Tambah Tag' onClick={() => openDialog('tag')} />}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Sales Person</label>
                <Select value={selectedSalesPersonId} onValueChange={setSelectedSalesPersonId}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue placeholder='Pilih Sales Person' />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Termin</label>
                <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue placeholder='Pilih Termin' />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermsData?.data.map((term) => (
                      <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Col 3: Logistics & Products */}
            <div className='scrollbar-thin space-y-4 overflow-y-auto p-4'>
              <h5 className='text-muted-foreground mb-4 text-xs font-bold uppercase tracking-wider'>Logistik & Produk</h5>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Ekspedisi</label>
                <Select value={selectedExpeditionId} onValueChange={setSelectedExpeditionId}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue placeholder='Pilih Ekspedisi' />
                  </SelectTrigger>
                  <SelectContent>
                    {expeditionsData?.data.map((exp) => (
                      <SelectItem key={exp.id} value={exp.id}>{exp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Kategori Produk</label>
                <ProductCategoryCombobox
                   value={selectedCategoryId}
                   onValueChange={setSelectedCategoryId}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Produk</label>
                <OrderFormCombobox
                  type='product'
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                  placeholder='Pilih Produk'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-semibold uppercase'>Attachment</label>
                <Select value={attachmentFilter} onValueChange={(v: 'all' | 'true' | 'false') => setAttachmentFilter(v)}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue placeholder='Semua' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua</SelectItem>
                    <SelectItem value='true'>Ada Attachment</SelectItem>
                    <SelectItem value='false'>Tidak Ada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
