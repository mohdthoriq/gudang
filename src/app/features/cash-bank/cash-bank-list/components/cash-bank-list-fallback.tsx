import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'

export function CashBankListFallback() {
  const dummyTransactions = [
    {
      date: '2024-03-01',
      ref: 'TR/0001',
      desc: 'Sewa Kantor',
      amount: '5.000.000',
      type: 'Keluar',
    },
    {
      date: '2024-03-02',
      ref: 'TR/0002',
      desc: 'Penjualan Produk',
      amount: '2.500.000',
      type: 'Masuk',
    },
    {
      date: '2024-03-03',
      ref: 'TR/0003',
      desc: 'Listrik & Air',
      amount: '1.200.000',
      type: 'Keluar',
    },
  ]

  return (
    <Card className='relative overflow-hidden'>
      <div className='pointer-events-none opacity-100 blur-[2px]'>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 flex items-center gap-4'>
              <h2 className='text-4xl font-bold tracking-tight'>Kas & Bank</h2>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button variant={'outline'}>
                <ArrowLeft className='h-4 w-4' />
                Kembali
              </Button>
              <Button>Transfer Dana</Button>
              <Button variant={'outline'}>
                <Printer className='h-4 w-4' />
                Cetak
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/50'>
                <tr className='border-b font-medium'>
                  <th className='p-4 text-left'>Tanggal</th>
                  <th className='p-4 text-left'>Referensi</th>
                  <th className='p-4 text-left'>Deskripsi</th>
                  <th className='p-4 text-right'>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {dummyTransactions.map((tx, i) => (
                  <tr key={i} className='border-b'>
                    <td className='p-4'>{tx.date}</td>
                    <td className='p-4'>{tx.ref}</td>
                    <td className='p-4'>{tx.desc}</td>
                    <td className='text-destructive p-4 text-right'>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
      <UpgradePlanCard feature='Daftar Transaksi Kas & Bank' />
    </Card>
  )
}
