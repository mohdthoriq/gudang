'use client'

import * as React from 'react'
import type { CompanyRole } from '@/types'
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCompanyRoleSettingsQuery } from '@/features/settings/company-roles/hooks/use-company-roles-query'

interface RolesComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  companyId?: string
  limit?: number
  disabled?: boolean
}

export function RolesCombobox({
  value = '',
  onValueChange,
  placeholder = 'Pilih peran...',
  companyId,
  limit = 20,
  disabled = false,
}: RolesComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [allRoles, setAllRoles] = React.useState<CompanyRole[]>([])
  const [selectedRole, setSelectedRole] = React.useState<CompanyRole | null>(
    null
  )
  const [hasMore, setHasMore] = React.useState(true)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const { data, isLoading, isError, refetch } = useCompanyRoleSettingsQuery({
    page: currentPage,
    limit,
    company_id: companyId,
  })

  React.useEffect(() => {
    setCurrentPage(1)
    setAllRoles([])
    setHasMore(true)
  }, [debouncedSearchTerm, companyId])

  React.useEffect(() => {
    if (data?.data) {
      if (currentPage === 1) {
        setAllRoles(data.data)
      } else {
        setAllRoles((prev) => {
          const newRoles = data.data.filter(
            (newRole) =>
              !prev.some((existingRole) => existingRole.id === newRole.id)
          )
          return [...prev, ...newRoles]
        })
      }
      const total = data.pagination?.total ?? 0
      const accumulated = (currentPage - 1) * limit + data.data.length
      setHasMore(accumulated < total)
    }
  }, [data, currentPage, limit])

  React.useEffect(() => {
    if (value) {
      const found = allRoles.find((r) => r.id === value)
      setSelectedRole(found ?? null)
    } else {
      setSelectedRole(null)
    }
  }, [value, allRoles])

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
  }

  const handleSelect = (roleId: string) => {
    const role = allRoles.find((p) => p.id === roleId)
    if (role) {
      setSelectedRole(role)
      onValueChange?.(roleId)
      setOpen(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchTerm('')
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          disabled={disabled}
        >
          {selectedRole ? selectedRole.name : placeholder}
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
        side='bottom'
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Cari peran...'
            value={searchTerm}
            onValueChange={handleSearch}
          />
          <CommandList>
            {isLoading && currentPage === 1 ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span className='text-muted-foreground ml-2 text-sm'>
                  Loading...
                </span>
              </div>
            ) : isError ? (
              <CommandEmpty>
                <div className='flex flex-col items-center py-4'>
                  <span className='text-muted-foreground mb-2 text-sm'>
                    Gagal memuat peran
                  </span>
                  <Button variant='outline' size='sm' onClick={() => refetch()}>
                    Retry
                  </Button>
                </div>
              </CommandEmpty>
            ) : allRoles.length === 0 ? (
              <CommandEmpty>Tidak ada peran.</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {allRoles.map((role) => (
                    <CommandItem
                      key={role.id}
                      value={role.id}
                      onSelect={() => handleSelect(role.id)}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === role.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{role.name}</span>
                        {role.description && (
                          <span className='text-muted-foreground text-xs'>
                            {role.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {hasMore && (
                  <div className='border-t'>
                    <Button
                      variant='ghost'
                      className='w-full justify-center py-2'
                      onClick={loadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Loading...
                        </>
                      ) : (
                        'Load more'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
