// import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
// import { Cell, Pie, PieChart } from 'recharts'
// import { cn } from '@/lib/utils'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip'
// import { useCurrentRatioQuery } from '../hooks/use-current-ratio-query'
// import { useDebtEquityRatioQuery } from '../hooks/use-debt-equity-ratio-query'
// import { useEquityRatioQuery } from '../hooks/use-equity-ratio-query'
// import { useQuickRatioQuery } from '../hooks/use-quick-ratio-query'

// interface BalanceSheetOverviewProps {
//   date: Date
// }

// export function BalanceSheetOverview({ date }: BalanceSheetOverviewProps) {
//   const commonParams = {
//     date,
//     date_from: date,
//     date_to: date,
//     period: 'month' as const,
//     tag_id: '',
//   }

//   const { data: quickData } = useQuickRatioQuery(commonParams)
//   const { data: currentData } = useCurrentRatioQuery(commonParams)
//   const { data: debtData } = useDebtEquityRatioQuery(commonParams)
//   const { data: equityData } = useEquityRatioQuery(commonParams)

//   // Quick Ratio Gauge Data
//   const quickRatioValue =
//     quickData?.balance_sheet_quick_ratio?.quick_ratio?.total ?? 0
//   const quickRatioTarget =
//     quickData?.balance_sheet_quick_ratio?.quick_ratio?.target ?? 0

//   // Custom Gauge with Needle
//   const RADIAN = Math.PI / 180

//   // Calculate needle angle
//   // Assuming scale 0 to 5 for ratio
//   const maxVal = 5
//   const angle = 180 - (Math.min(quickRatioValue, maxVal) / maxVal) * 180

//   const needle = (
//     _value: number,
//     _data: unknown[],
//     cx: number,
//     cy: number,
//     iR: number,
//     oR: number,
//     color: string
//   ) => {
//     const length = (iR + 2 * oR) / 3
//     const sin = Math.sin(-RADIAN * angle)
//     const cos = Math.cos(-RADIAN * angle)
//     const r = 5
//     const x0 = cx + 5
//     const y0 = cy + 5
//     const xba = x0 + r * sin
//     const yba = y0 - r * cos
//     const xbb = x0 - r * sin
//     const ybb = y0 + r * cos
//     const xp = x0 + length * cos
//     const yp = y0 + length * sin

//     return [
//       <circle cx={x0} cy={y0} r={r} fill={color} stroke='none' key='circle' />,
//       <path
//         d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
//         stroke='none'
//         fill={color}
//         key='path'
//       />,
//     ]
//   }

//   // Helper to render trend
//   const renderTrend = (
//     percent: number = 0,
//     label: string = 'vs bulan sebelumnya'
//   ) => {
//     const isPositive = percent > 0
//     const isNegative = percent < 0
//     const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
//     const colorClass = isPositive
//       ? 'text-green-500'
//       : isNegative
//         ? 'text-red-500'
//         : 'text-gray-400'

//     return (
//       <div className='flex flex-col items-end'>
//         <Icon className={cn('mb-1 h-8 w-8', colorClass)} />
//         <span className={cn('text-xs font-medium', colorClass)}>
//           {percent}%
//         </span>
//         <span className='text-muted-foreground text-right text-[10px]'>
//           {label}
//         </span>
//       </div>
//     )
//   }

//   return (
//     <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
//       {/* QUICK RATIO */}
//       <Card className='bg-card text-card-foreground'>
//         <CardHeader className='flex flex-row items-center justify-between space-y-0'>
//           <CardTitle className='text-sm font-medium tracking-wider uppercase'>
//             Quick Ratio
//           </CardTitle>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 <HelpCircle className='text-muted-foreground h-4 w-4' />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Quick Ratio measuring liquidity</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </CardHeader>
//         <CardContent>
//           <div className='flex items-center justify-between'>
//             <div className='flex flex-col'>
//               <span className='text-2xl font-bold'>{quickRatioValue}</span>
//               <span className='text-muted-foreground mt-1 text-xs'>
//                 Target {quickRatioTarget}
//               </span>
//             </div>
//             <div className='relative -mt-6 h-[80px] w-[140px]'>
//               <PieChart width={140} height={140}>
//                 <Pie
//                   dataKey='value'
//                   startAngle={180}
//                   endAngle={0}
//                   data={[
//                     { name: 'A', value: 20, color: '#e5e7eb' }, // grey
//                     { name: 'B', value: 20, color: '#93c5fd' }, // light blue
//                     { name: 'C', value: 20, color: '#3b82f6' }, // blue
//                     { name: 'D', value: 20, color: '#fcd34d' }, // yellow
//                     { name: 'E', value: 20, color: '#f87171' }, // red
//                   ]}
//                   cx='50%'
//                   cy='50%'
//                   innerRadius={35}
//                   outerRadius={65}
//                   stroke='none'
//                 >
//                   {[
//                     { name: 'A', value: 20, color: '#e5e7eb' },
//                     { name: 'B', value: 20, color: '#93c5fd' },
//                     { name: 'C', value: 20, color: '#3b82f6' },
//                     { name: 'D', value: 20, color: '#fcd34d' },
//                     { name: 'E', value: 20, color: '#f87171' },
//                   ].map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 {needle(quickRatioValue, [], 70, 70, 35, 65, '#374151')}
//               </PieChart>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* CURRENT RATIO */}
//       <Card>
//         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//           <CardTitle className='text-sm font-medium tracking-wider uppercase'>
//             Current Ratio
//           </CardTitle>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 <HelpCircle className='text-muted-foreground h-4 w-4' />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Current Ratio = Current Assets / Current Liabilities</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </CardHeader>
//         <CardContent>
//           <div className='flex items-end justify-between'>
//             <div className='flex flex-col'>
//               <span className='text-3xl font-bold'>
//                 {currentData?.balance_sheet_current_ratio?.current_ratio?.total?.toLocaleString(
//                   'id-ID',
//                   { maximumFractionDigits: 2 }
//                 ) ?? '0'}
//               </span>
//               <span className='text-muted-foreground mt-1 text-xs'>
//                 Hari Ini
//               </span>
//             </div>
//             {renderTrend(
//               currentData?.balance_sheet_current_ratio?.current_ratio?.percent
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* DEBT EQUITY RATIO */}
//       <Card>
//         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//           <CardTitle className='text-sm font-medium tracking-wider uppercase'>
//             Debt Equity Ratio
//           </CardTitle>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 <HelpCircle className='text-muted-foreground h-4 w-4' />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Debt to Equity Ratio</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </CardHeader>
//         <CardContent>
//           <div className='flex items-end justify-between'>
//             <div className='flex flex-col'>
//               <span className='text-3xl font-bold'>
//                 {debtData?.balance_sheet_debt_equity_ratio?.debt_to_equity_ratio?.value?.toLocaleString(
//                   'id-ID',
//                   { maximumFractionDigits: 2 }
//                 ) ?? '0'}
//               </span>
//               <span className='text-muted-foreground mt-1 text-xs'>
//                 Hari Ini
//               </span>
//             </div>
//             {renderTrend(
//               debtData?.balance_sheet_debt_equity_ratio?.debt_to_equity_ratio
//                 ?.percent
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* EQUITY RATIO */}
//       <Card>
//         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//           <CardTitle className='text-sm font-medium tracking-wider uppercase'>
//             Equity Ratio
//           </CardTitle>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger>
//                 <HelpCircle className='text-muted-foreground h-4 w-4' />
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Equity Ratio</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </CardHeader>
//         <CardContent>
//           <div className='flex items-end justify-between'>
//             <div className='flex flex-col'>
//               <span className='text-3xl font-bold'>
//                 {equityData?.balance_sheet_equity_ratio?.equity_ratio.total?.toLocaleString(
//                   'id-ID',
//                   { maximumFractionDigits: 2 }
//                 ) ?? '0'}
//               </span>
//               <span className='text-muted-foreground mt-1 text-xs'>
//                 Hari Ini
//               </span>
//             </div>
//             {renderTrend(
//               equityData?.balance_sheet_equity_ratio?.equity_ratio.percent
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
