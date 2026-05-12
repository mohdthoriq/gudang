import type { LinkProps } from '@tanstack/react-router'

export interface ReportData {
  id: number
  category: string
  reports: Report[]
}

export interface Report {
  id: number
  name: string
  url?: LinkProps['to']
}
