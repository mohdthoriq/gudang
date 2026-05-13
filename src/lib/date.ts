import { format as dateFnsFormat } from 'date-fns'
import { tz } from '@date-fns/tz'

const DEFAULT_TIMEZONE = 'Asia/Jakarta'

/**
 * Custom format function that defaults to Asia/Jakarta timezone.
 * Requires @date-fns/tz to be installed.
 */
export function format(
  date: Date | number | string,
  formatStr: string,
  options?: Parameters<typeof dateFnsFormat>[2]
) {
  return dateFnsFormat(date, formatStr, {
    ...options,
    in: tz(DEFAULT_TIMEZONE),
  })
}
