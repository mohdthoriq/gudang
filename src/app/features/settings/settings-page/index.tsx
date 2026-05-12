import { useNavigate, useSearch } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Tabs } from '@/components/ui/tabs'
import { PermissionGuard } from '@/components/permission-guard'
import { SettingsHeader } from './components/settings-header'
import { SettingsPageFallback } from './components/settings-page-fallback'
import { SettingsTabContent } from './components/settings-tab-content'
import { SettingsTabsList } from './components/settings-tabs-list'
import { settingsTabs } from './constants/settings-constants'
import { useSettingsScroll } from './hooks/use-settings-scroll'

function Settings() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { tab?: string }
  const currentTab = search.tab || settingsTabs[0].value
  const isDesktop = useMediaQuery('(min-width: 1200px)')

  const { scrollAreaRef, tabRefs } = useSettingsScroll({
    currentTab,
    isDesktop,
  })

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.SETTINGS}
      fallback={<SettingsPageFallback />}
    >
      <div className='w-full flex-1 space-y-3 overflow-hidden'>
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
    </PermissionGuard>
  )
}

export { Settings }
