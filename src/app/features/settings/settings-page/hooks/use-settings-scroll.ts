import { useEffect, useRef, type RefObject } from 'react'

interface UseSettingsScrollProps {
  currentTab: string
  isDesktop: boolean
}

export function useSettingsScroll({
  currentTab,
  isDesktop,
}: UseSettingsScrollProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    if (isDesktop) return

    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement | null

    const activeTab = tabRefs.current[currentTab]
    if (!viewport || !activeTab) return

    requestAnimationFrame(() => {
      const scrollLeft =
        activeTab.offsetLeft -
        viewport.offsetWidth / 2 +
        activeTab.offsetWidth / 2

      viewport.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    })
  }, [currentTab, isDesktop])

  return { scrollAreaRef, tabRefs }
}
