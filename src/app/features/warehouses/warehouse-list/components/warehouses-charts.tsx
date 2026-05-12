// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useWarehousesQuery } from '../hooks/use-warehouses-query'
// import { formatNumber } from '@/lib/utils'

// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

// export function WarehousesCharts() {
//   const { data } = useWarehousesQuery({ limit: 100 })
//   const warehouses = data?.data ?? []

//   const dataStock = warehouses.map(w => ({
//     name: w.name,
//     value: w.total_quantity || 0
//   })).filter(d => d.value > 0)

//   const dataValue = warehouses.map(w => ({
//     name: w.name,
//     value: w.total_value || 0
//   })).filter(d => d.value > 0)

//   // Fallback if no data
//   const emptyData = [{ name: 'Tidak ada data', value: 1 }]

//   return (
//     <div className='grid gap-4 md:grid-cols-2'>
//       <Card className='shadow-sm border-none bg-slate-50/50 dark:bg-slate-900/50'>
//         <CardHeader>
//           <CardTitle className='text-sm font-bold uppercase text-muted-foreground tracking-wider'>
//             Distribusi Stok Per Gudang
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className='h-[300px] w-full'>
//             <ResponsiveContainer width='100%' height='100%'>
//               <PieChart>
//                 <Pie
//                   data={dataStock.length > 0 ? dataStock : emptyData}
//                   cx='50%'
//                   cy='50%'
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey='value'
//                 >
//                   {dataStock.length > 0 ? dataStock.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   )) : <Cell fill='#e2e8f0' />}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Kuantitas']}
//                 />
//                 <Legend layout='horizontal' align='center' verticalAlign='bottom' />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className='shadow-sm border-none bg-slate-50/50 dark:bg-slate-900/50'>
//         <CardHeader>
//           <CardTitle className='text-sm font-bold uppercase text-muted-foreground tracking-wider'>
//             Distribusi Nilai Produk Per Gudang
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className='h-[300px] w-full'>
//             <ResponsiveContainer width='100%' height='100%'>
//               <PieChart>
//                 <Pie
//                   data={dataValue.length > 0 ? dataValue : emptyData}
//                   cx='50%'
//                   cy='50%'
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey='value'
//                 >
//                   {dataValue.length > 0 ? dataValue.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   )) : <Cell fill='#e2e8f0' />}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value: number | undefined) => [`Rp ${formatNumber(value ?? 0)}`, 'Nilai']}
//                 />
//                 <Legend layout='horizontal' align='center' verticalAlign='bottom' />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
