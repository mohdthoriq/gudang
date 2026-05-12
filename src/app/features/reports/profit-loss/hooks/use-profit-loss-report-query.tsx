import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import type { ApiResponse, ProfitLossReportData } from '@/types'
import apiClient from '@/lib/api-client'

export enum Option {
  Periode = 'periode',
  Tag = 'tag',
  Quarter = 'quarter',
}

export enum AccountDisplayOption {
  CodeName = 'code_name',
  BracketCodeName = 'bracket_code_name',
  NameCode = 'name_code',
  NameBracketCode = 'name_bracket_code',
  NameOnly = 'name_only',
}
export interface ProfitLossReportQuery {
  date_from: Date
  date_to: Date
  tag_id: string
  currency_id: string
  comparison_date_from?: Date
  comparison_date_to?: Date
  view_by: Option
  comparison_periods: number
  sort_by: 'name' | 'code'
  account_display: AccountDisplayOption
  hide_sub_account: boolean
  separate_other_income_expense: boolean
}

export function useProfitLossReportQuery(params?: ProfitLossReportQuery) {
  return useQuery({
    queryKey: [
      'profit-loss-report',
      params?.date_from,
      params?.date_to,
      params?.tag_id,
      params?.currency_id,
      params?.comparison_date_from,
      params?.comparison_date_to,
      params?.view_by,
      params?.comparison_periods,
      params?.sort_by,
      params?.account_display,
      params?.hide_sub_account,
      params?.separate_other_income_expense,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...(params?.date_from
          ? { date_from: format(params.date_from, 'yyyy-MM-dd') }
          : {}),
        ...(params?.date_to
          ? { date_to: format(params.date_to, 'yyyy-MM-dd') }
          : {}),
        ...(params?.tag_id ? { tag_id: params.tag_id } : {}),
        ...(params?.currency_id ? { currency_id: params.currency_id } : {}),
        ...(params?.comparison_date_from
          ? {
              comparison_date_from: format(
                params.comparison_date_from,
                'yyyy-MM-dd'
              ),
            }
          : {}),
        ...(params?.comparison_date_to
          ? {
              comparison_date_to: format(
                params.comparison_date_to,
                'yyyy-MM-dd'
              ),
            }
          : {}),
        ...(params?.view_by ? { view_by: params.view_by } : {}),
        ...(params?.comparison_periods
          ? { comparison_periods: params.comparison_periods.toString() }
          : {}),
        ...(params?.sort_by ? { sort_by: params.sort_by } : {}),
        ...(params?.account_display
          ? { account_display: params.account_display }
          : {}),
        ...(params?.hide_sub_account
          ? { hide_sub_account: String(params.hide_sub_account) }
          : {}),
        ...(params?.separate_other_income_expense
          ? {
              separate_other_income_expense: String(
                params.separate_other_income_expense
              ),
            }
          : {}),
      })

      const url = queryParams.toString()
        ? `/reports/laba-rugi?${queryParams.toString()}`
        : `/reports/laba-rugi`
      const response =
        await apiClient.get<ApiResponse<ProfitLossReportData>>(url)

      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
