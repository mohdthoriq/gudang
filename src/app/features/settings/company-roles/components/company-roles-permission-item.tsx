import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type PermissionTreeItem } from '@/features/admin/plans/hooks/use-permission-tree-query'

interface CompanyRolesPermissionItemProps {
  item: PermissionTreeItem
  selectedIds: string[]
  expandedIds: string[]
  onToggle: (id: string, children: PermissionTreeItem[]) => void
  onExpand: (id: string) => void
}

export function CompanyRolesPermissionItem({
  item,
  selectedIds,
  expandedIds,
  onToggle,
  onExpand,
}: CompanyRolesPermissionItemProps) {
  const isExpanded = expandedIds.includes(item.id)
  const isSelected = selectedIds.includes(item.id)
  const hasChildren = item.children && item.children.length > 0

  return (
    <div className='ml-4'>
      <div className='flex items-center gap-2 py-1'>
        {hasChildren ? (
          <Button
            type='button'
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
          checked={isSelected}
          onCheckedChange={() => onToggle(item.id, item.children || [])}
        />
        <label
          htmlFor={item.id}
          className='cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {item.description || item.name}
        </label>
        <span className='text-muted-foreground text-xs'>({item.name})</span>
      </div>
      {hasChildren && isExpanded && (
        <div className='ml-3 border-l pl-2'>
          {item.children?.map((child: PermissionTreeItem) => (
            <CompanyRolesPermissionItem
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
