import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { CompanyRolesPermissionItem } from './company-roles-permission-item'
import { getAllChildIds } from '../utils/company-roles-utils'
import { type PermissionTreeItem } from '@/features/admin/plans/hooks/use-permission-tree-query'

interface CompanyRolesFormPermissionsProps {
  tree?: PermissionTreeItem[] | null
  isLoading: boolean
  selectedIds: string[]
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
  expandedIds: string[]
  setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export function CompanyRolesFormPermissions({
  tree,
  isLoading,
  selectedIds,
  setSelectedIds,
  expandedIds,
  setExpandedIds,
}: CompanyRolesFormPermissionsProps) {
  const handleToggle = (id: string, children: PermissionTreeItem[]) => {
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

  return (
    <div className='flex flex-col space-y-6'>
      <div>
        <h3 className="text-lg font-medium">Hak Akses</h3>
        <p className="text-sm text-muted-foreground">
          Pilih hak akses yang akan diberikan ke peran ini.
        </p>
      </div>

      <div className='rounded-md border bg-card p-4'>
        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-8 w-[200px]' />
            <Skeleton className='h-[300px] w-full' />
          </div>
        ) : (
          <ScrollArea className='h-[400px] pr-4'>
            <div className='space-y-4'>
              {tree?.map((item: PermissionTreeItem) => (
                <CompanyRolesPermissionItem
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
      </div>
    </div>
  )
}