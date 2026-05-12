import { Link } from '@tanstack/react-router'
import { ArrowLeft, CircleArrowUp } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from './ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'

interface UpgradePlanCardProps {
  feature: string
  type?: 'dialog' | 'page'
}

export function UpgradePlanCard({
  feature,
  type = 'page',
}: UpgradePlanCardProps) {
  const user = useAuthStore((state) => state.auth?.user)

  if (user?.role?.name === 'Administrator') {
    return (
      <div className='absolute inset-0 z-10 flex items-start justify-center p-4'>
        <Card className='bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full max-w-md shadow-lg backdrop-blur'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>
              {type === 'page'
                ? 'Fitur Tidak Tersedia'
                : `Fitur ${feature} Tidak Tersedia`}
            </CardTitle>
            {type === 'page' && (
              <CardDescription className='mt-2 text-base'>
                Fitur {feature} tidak tersedia pada paket Anda saat ini. Silakan
                upgrade paket untuk menggunakan fitur ini.
              </CardDescription>
            )}
          </CardHeader>
          <CardFooter className='flex justify-center border-t'>
            <Button className='h-11 w-full bg-green-600/70 text-base hover:bg-green-600/80'>
              <CircleArrowUp className='h-6 w-6' />
              <Link to='/settings/subscription'>Upgrade Paket</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  } else {
    return (
      <div className='absolute inset-0 z-10 flex items-start justify-center p-4'>
        <Card className='bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full max-w-md shadow-lg backdrop-blur'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>
              {type === 'page'
                ? 'Fitur Tidak Tersedia'
                : `Fitur ${feature} Tidak Tersedia`}
            </CardTitle>
            {type === 'page' && (
              <CardDescription className='mt-2 text-base'>
                Anda tidak memiliki akses untuk menggunakan fitur ini. Silakan
                hubungi administrator untuk konfirmasi.
              </CardDescription>
            )}
          </CardHeader>
          <CardFooter className='flex justify-center border-t'>
            <Button className='h-11 w-full bg-yellow-600/70 text-base hover:bg-yellow-600/80'>
              <ArrowLeft className='h-6 w-6' />
              <Link to='/'>Kembali</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
}
