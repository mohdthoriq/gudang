import { useNavigate, useSearch } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Tabs } from '@/components/ui/tabs'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { settingsTabs } from '../constants/settings-constants'
import { useSettingsScroll } from '../hooks/use-settings-scroll'
import { SettingsHeader } from './settings-header'
import { SettingsTabContent } from './settings-tab-content'
import { SettingsTabsList } from './settings-tabs-list'

export function SettingsPageFallback() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { tab?: string }
  const currentTab = search.tab || settingsTabs[0].value
  const isDesktop = useMediaQuery('(min-width: 1200px)')

  const { scrollAreaRef, tabRefs } = useSettingsScroll({
    currentTab,
    isDesktop,
  })

  return (
    <div className='relative'>
      <div className='pointer-events-none w-full flex-1 space-y-3 overflow-hidden opacity-100 blur-[2px]'>
        <SettingsHeader />

        <hr />

        <Tabs
          orientation={isDesktop ? 'vertical' : 'horizontal'}
          value={currentTab}
          onValueChange={(value) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigate({ search: { tab: value } as any })
          }
          className={cn(
            'flex w-full gap-6',
            isDesktop
              ? 'mt-8 flex-row items-start justify-center'
              : 'mt-2 flex-col'
          )}
        >
          <SettingsTabsList
            isDesktop={isDesktop}
            scrollAreaRef={scrollAreaRef}
            tabRefs={tabRefs}
          />

          <SettingsTabContent />
        </Tabs>
      </div>
      <UpgradePlanCard feature='Setting' />
    </div>
  )
}
