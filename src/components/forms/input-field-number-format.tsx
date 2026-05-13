import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface InputFieldNumberFormatProps
  extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value?: number | string
  onValueChange?: (value: number | undefined) => void
  prefix?: string
}

export const InputFieldNumberFormat = forwardRef<
  HTMLInputElement,
  InputFieldNumberFormatProps
>(({ value, onValueChange, className, prefix, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [displayValue, setDisplayValue] = useState<string>(formatNumber(value))

  // Sync display value when prop value changes from outside (e.g. form reset)
  useEffect(() => {
    const formatted = formatNumber(value)

    if (formatted !== displayValue) {
      setDisplayValue(formatted)
    }
  }, [value, displayValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const originalValue = input.value ?? ''
    const selectionStart = input.selectionStart || 0

    // Get digits only
    const rawValue = originalValue.replace(/[^\d]/g, '')

    if (rawValue === '') {
      setDisplayValue('')
      onValueChange?.(0)
      return
    }

    const numericValue = parseInt(rawValue, 10)
    const formattedValue = formatNumber(numericValue)

    // Calculate how many non-digits were before the cursor in the original value
    const nonDigitsBefore = (
      originalValue.slice(0, selectionStart).match(/[^\d]/g) || []
    ).length
    // Calculate how many non-digits are in the new value up to the same number of digits
    const digitsBefore = selectionStart - nonDigitsBefore

    let newSelectionStart = 0
    let digitsCount = 0
    for (
      let i = 0;
      i < formattedValue.length && digitsCount < digitsBefore;
      i++
    ) {
      if (/\d/.test(formattedValue[i])) {
        digitsCount++
      }
      newSelectionStart++
    }

    // Set value and position
    setDisplayValue(formattedValue)
    onValueChange?.(numericValue)

    // Selection position must be set after React updates the DOM
    window.requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newSelectionStart, newSelectionStart)
      }
    })
  }

  useImperativeHandle(ref, () => inputRef.current!)

  return (
    <Input
      {...props}
      ref={inputRef}
      type='text'
      value={displayValue}
      onChange={handleChange}
      className={cn('text-right font-medium w-full', className)}
      startAdornment={
        prefix && (
          <span className='text-muted-foreground font-semibold'>{prefix}</span>
        )
      }
    />
  )
})

InputFieldNumberFormat.displayName = 'InputFieldNumberFormat'
