import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OfflineError() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <WifiOff
          size={120}
          strokeWidth={1.5}
          className='text-muted-foreground mb-4'
        />
        <h1 className='text-4xl font-bold'>Tidak Ada Koneksi Internet</h1>
        <p className='text-muted-foreground text-center'>
          Sepertinya kamu sedang offline. <br />
          Periksa koneksi internet kamu dan coba lagi.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    </div>
  )
}
