import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      startAdornment,
      endAdornment,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className='space-y-1'>
        {label && (
          <label
            htmlFor={inputId}
            className='text-foreground text-sm font-medium'
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex h-9 items-center rounded-md border bg-transparent px-0 transition-all',
            'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
            error && 'border-destructive focus-within:ring-destructive/50'
          )}
        >
          {startAdornment && (
            <span className='text-muted-foreground flex items-center px-3 text-sm'>
              {startAdornment}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30',
              'h-9 flex-1 border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none',
              'disabled:pointer-events-none disabled:opacity-50 md:text-sm',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />

          {endAdornment && (
            <span className='text-muted-foreground flex items-center px-3 text-sm'>
              {endAdornment}
            </span>
          )}
        </div>

        {description && !error && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}

        {error && <p className='text-destructive text-xs'>{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
