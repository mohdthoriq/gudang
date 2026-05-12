import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { settingsTabs } from '../constants/settings-constants'

interface SettingsTabsListProps {
  isDesktop: boolean
  scrollAreaRef: React.RefObject<HTMLDivElement>
  tabRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>
}

export function SettingsTabsList({
  isDesktop,
  scrollAreaRef,
  tabRefs,
}: SettingsTabsListProps) {
  const renderTabs = () => (
    <TabsList
      className={cn(
        'shrink-0 gap-1 bg-transparent p-0',
        isDesktop ? 'grid w-64 grid-cols-1' : 'flex w-max'
      )}
    >
      {settingsTabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          ref={(el) => {
            tabRefs.current[tab.value] = el
          }}
          className={cn(
            'data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground hover:bg-sidebar-accent h-auto px-4 py-1.5 text-sm font-medium transition-all',
            isDesktop ? 'justify-start' : 'h-full min-w-fit justify-start py-4'
          )}
        >
          <tab.icon className='me-3 h-5 w-5' /> {tab.name}
        </TabsTrigger>
      ))}
    </TabsList>
  )

  if (isDesktop) {
    return renderTabs()
  }

  return (
    <ScrollArea
      orientation='horizontal'
      className={cn(isDesktop ? '' : 'w-full py-4')}
      ref={scrollAreaRef}
    >
      <div className='w-full'>{renderTabs()}</div>
    </ScrollArea>
  )
}
