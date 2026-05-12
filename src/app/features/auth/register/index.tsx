import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import businessIllustrator from '../login/assets/web-illustration.jpg'
import { RegisterForm } from './components/register-form'

export function Register() {
  return (
    <div className='relative grid h-svh overflow-hidden lg:max-w-none lg:grid-cols-2'>
      {/* Left Section - Fixed */}
      <div
        className={cn(
          'bg-muted before:bg-primary/30 relative h-full overflow-hidden before:absolute before:inset-0 before:z-10 max-lg:hidden',
          'before:pointer-events-none [&>img]:absolute [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <img
          src={businessIllustrator}
          className='dark:hidden'
          width={1024}
          height={1151}
          alt='Shadcn-Admin'
        />
        <img
          src={businessIllustrator}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt='Shadcn-Admin'
        />
      </div>

      {/* Right Section - Scrollable */}
      <div className='h-full overflow-y-auto'>
        <div className='container flex min-h-full items-center justify-center px-4 py-16 lg:px-8'>
          <div className='mx-auto flex w-full max-w-md flex-col justify-center space-y-2'>
            <div className='flex flex-col space-y-2 text-start'>
              <h2 className='text-primary text-2xl font-semibold tracking-tight'>
                Buat Akun Baru
              </h2>
              <p className='text-muted-foreground text-sm'>
                Masukkan email dan password untuk membuat akun. <br />
                Sudah punya akun?{' '}
                <Link
                  to='/login'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Masuk
                </Link>
              </p>
            </div>
            {/* ========= Register Form ========= */}
            <RegisterForm className='mt-2' />

            <div>
              <p className='text-muted-foreground px-8 text-center text-sm'>
                Dengan membuat akun, Anda menyetujui{' '}
                <a
                  href='/terms'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Ketentuan Layanan
                </a>{' '}
                dan{' '}
                <a
                  href='/privacy'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Kebijakan Privasi
                </a>{' '}
                kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
