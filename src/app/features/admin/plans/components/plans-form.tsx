import { useState, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { type Plan, type ApiResponse } from '@/types'
import {
  Plus,
  Trash2,
  Save,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react'

const getAllChildIds = (children?: PermissionTreeItem[]): string[] => {
  if (!children) return []
  let ids: string[] = []
  children.forEach((child) => {
    ids.push(child.id)
    if (child.children && child.children.length > 0) {
      ids = [...ids, ...getAllChildIds(child.children)]
    }
  })
  return ids
}

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import {
  usePermissionTreeQuery,
  type PermissionTreeItem,
} from '../hooks/use-permission-tree-query'
import {
  usePlanPermissionsQuery,
  useUpdatePlanPermissionsMutation,
} from '../hooks/use-plan-permissions'
import { usePlansForm } from '../hooks/use-plans-form'
import { usePlanDetailQuery } from '../hooks/use-plans-query'

type PlansFormProps = {
  mode: 'add' | 'edit'
  planId?: string
}

export function PlansForm({ mode, planId }: PlansFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit' && !!planId

  const { data: currentRow, isLoading: isPlanLoading } = usePlanDetailQuery(
    planId || ''
  )

  const { form, onSubmit, isSubmitting } = usePlansForm({
    currentRow,
    onSuccess: (data: ApiResponse<Plan> | undefined) => {
      if (mode === 'add' && data?.data?.id) {
        navigate({ to: `/admin/plans/${data.data.id}` })
      }
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features' as never,
  })

  const is_active = form.watch('is_active')

  // Permissions logic (only for edit mode)
  const { data: tree, isLoading: isTreeLoading } = usePermissionTreeQuery()
  const {
    data: currentPermissions,
    isSuccess: isPermsSuccess,
    isLoading: isPermsLoading,
  } = usePlanPermissionsQuery(planId || '')
  const updatePermsMutation = useUpdatePlanPermissionsMutation(planId || '')

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  useEffect(() => {
    if (isPermsSuccess && currentPermissions) {
      const timer = setTimeout(() => {
        setSelectedIds(currentPermissions)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isPermsSuccess, currentPermissions])

  const handleToggle = (id: string, children: PermissionTreeItem[] = []) => {
    const allChildIds = getAllChildIds(children)
    const idsToToggle = [id, ...allChildIds]

    setSelectedIds((prev) => {
      const isSelected = prev.includes(id)
      if (isSelected) {
        return prev.filter((item) => !idsToToggle.includes(item))
      } else {
        return Array.from(new Set([...prev, ...idsToToggle]))
      }
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSavePermissions = () => {
    updatePermsMutation.mutate(selectedIds)
  }

  if (isEdit && (isPlanLoading || isPermsLoading || isTreeLoading)) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-[200px]' />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Skeleton className='h-[600px] w-full' />
          <Skeleton className='h-[600px] w-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => navigate({ to: '/admin/plans' })}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold tracking-tight'>
            {isEdit ? `Edit Plan: ${currentRow?.name}` : 'Tambah Plan Baru'}
          </h1>
        </div>
        <div className='flex items-center gap-2'>
          {isEdit && (
            <Button
              variant='outline'
              onClick={handleSavePermissions}
              disabled={updatePermsMutation.isPending}
            >
              <Save className='mr-2 h-4 w-4' />
              Save Permissions Only
            </Button>
          )}
          <Button type='submit' form='plans-form' disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEdit
                ? 'Update Plan Info'
                : 'Create Plan'}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Plan Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>
              Informasi dasar mengenai plan ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id='plans-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Plan</FormLabel>
                      <FormControl>
                        <Input placeholder='Masukkan nama plan...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Plan</FormLabel>
                      <FormControl>
                        <Input placeholder='Masukkan kode plan...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='monthly_price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Bulanan</FormLabel>
                        <FormControl>
                          <InputFieldNumberFormat
                            prefix='Rp'
                            value={field.value ?? 0}
                            onValueChange={(value) =>
                              field.onChange(value ? value : 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='yearly_price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Tahunan</FormLabel>
                        <FormControl>
                          <InputFieldNumberFormat
                            prefix='Rp'
                            value={field.value ?? 0}
                            onValueChange={(value) =>
                              field.onChange(value ? value : 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <FormLabel>Fitur - fitur</FormLabel>
                  <div className='space-y-2'>
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`features.${index}` as never}
                        render={({ field: inputField }) => (
                          <div className='flex w-full flex-col gap-1'>
                            <div className='flex w-full items-center gap-2'>
                              <div className='flex-1'>
                                <FormControl>
                                  <Input
                                    {...inputField}
                                    placeholder={`Fitur ${index + 1}`}
                                    className='w-full'
                                  />
                                </FormControl>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600'
                                onClick={() => remove(index)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
                        )}
                      />
                    ))}
                    <Button
                      type='button'
                      variant='default'
                      size='sm'
                      className='mt-2 w-full'
                      onClick={() => append('')}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Tambah Fitur
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='is_active'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <FormLabel>
                        {is_active ? 'Aktif' : 'Tidak Aktif'}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Masukkan deskripsi plan...'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className='overflow-hidden'>
          <CardHeader>
            <CardTitle>Manage Permissions</CardTitle>
            <CardDescription>
              {isEdit
                ? 'Tentukan hak akses untuk plan ini.'
                : 'Simpan plan terlebih dahulu untuk mengatur permission.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEdit ? (
              <div className='flex min-h-[300px] items-center justify-center rounded-lg border border-dashed'>
                <p className='text-muted-foreground'>
                  Tersedia setelah plan dibuat.
                </p>
              </div>
            ) : (
              <ScrollArea className='h-[calc(100vh-280px)] min-h-[400px] pr-4'>
                <div className='space-y-4'>
                  {tree?.map((item: PermissionTreeItem) => (
                    <PermissionItem
                      key={item.id}
                      item={item}
                      selectedIds={selectedIds}
                      expandedIds={expandedIds}
                      onToggle={handleToggle}
                      onExpand={toggleExpand}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface PermissionItemProps {
  item: PermissionTreeItem
  selectedIds: string[]
  expandedIds: string[]
  onToggle: (id: string, children?: PermissionTreeItem[]) => void
  onExpand: (id: string) => void
}

function PermissionItem({
  item,
  selectedIds,
  expandedIds,
  onToggle,
  onExpand,
}: PermissionItemProps) {
  const isExpanded = expandedIds.includes(item.id)
  const isSelected = selectedIds.includes(item.id)
  const hasChildren = !!(item.children && item.children.length > 0)
  const allChildIds = getAllChildIds(item.children || [])
    const selectedChildrenCount = allChildIds.filter((id) =>
      selectedIds.includes(id)
    ).length
    const isAllSelected =
      hasChildren && allChildIds.length > 0
        ? selectedChildrenCount === allChildIds.length
        : isSelected
    const isIndeterminate =
      hasChildren &&
      selectedChildrenCount > 0 &&
      selectedChildrenCount < allChildIds.length

    return (
      <div className='ml-4'>
        <div className='flex items-center gap-2 py-2'>
          {hasChildren ? (
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={() => onExpand(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
          ) : (
            <div className='w-6' />
          )}
          <Checkbox
            id={item.id}
            checked={isIndeterminate ? 'indeterminate' : isAllSelected}
            onCheckedChange={() => onToggle(item.id, item.children)}
          />
        <label
          htmlFor={item.id}
          className='cursor-pointer text-sm leading-none font-medium'
        >
          {item.description || item.name}
        </label>
        <span className='text-muted-foreground text-xs'>({item.name})</span>
      </div>
      {hasChildren && isExpanded && item.children && (
        <div className='ml-3 border-l pl-2'>
          {item.children.map((child: PermissionTreeItem) => (
            <PermissionItem
              key={child.id}
              item={child}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}
