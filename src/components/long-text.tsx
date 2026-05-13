"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type LongTextProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function LongText({
  children,
  className = '',
  contentClassName = '',
}: LongTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflown, setIsOverflown] = useState(false)

  // Fungsi deteksi overflow
  const checkOverflow = (node: HTMLDivElement | null) => {
    if (!node) return false
    return node.offsetWidth < node.scrollWidth || node.offsetHeight < node.scrollHeight
  }

  useEffect(() => {
    const check = () => {
      if (containerRef.current) {
        setIsOverflown(checkOverflow(containerRef.current))
      }
    }

    check()
    // Opsional: Tambahkan resize listener jika lebar container bisa berubah
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [children])

  const content = (
    <div ref={containerRef} className={cn('truncate', className)}>
      {children}
    </div>
  )

  if (!isOverflown) return content

  return (
    <>
      {/* Desktop View: Tooltip */}
      <div className='hidden sm:block'>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent>
              <p className={contentClassName}>{children}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile View: Popover */}
      <div className='sm:hidden'>
        <Popover>
          <PopoverTrigger asChild>
            {content}
          </PopoverTrigger>
          <PopoverContent className={cn('w-fit max-w-[90vw]', contentClassName)}>
            <p className="text-sm">{children}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
