import { useNavigate } from '@tanstack/react-router'
import { type AuthPurpose } from '@/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface UnverifiedEmailDialogProps {
  open: boolean
  purpose: AuthPurpose
  onOpenChange: (open: boolean) => void
  email: string
  onResendOtp: () => void
  onGoToVerify: () => void
}

export function UnverifiedEmailDialog({
  open,
  purpose,
  onOpenChange,
  email,
  onResendOtp,
  onGoToVerify,
}: UnverifiedEmailDialogProps) {
  const navigate = useNavigate()

  const handleGoToVerify = () => {
    onGoToVerify()
    navigate({
      to: '/verify-email',
      search: {
        email,
        purpose,
      },
    })
    onOpenChange(false)
  }

  const handleResendOtp = () => {
    onResendOtp()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Anda belum melakukan verifikasi email
          </AlertDialogTitle>
          <AlertDialogDescription>
            Email Anda ({email}) belum diverifikasi. <br /> Silakan verifikasi
            email Anda untuk melanjutkan. Anda dapat meminta kode OTP baru atau
            langsung ke halaman verifikasi email.
            <br />
            <span
              onClick={handleResendOtp}
              className='hover:text-primary mt-2 cursor-pointer underline'
            >
              Kirim ulang OTP
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleGoToVerify}>
            Ke Halaman Verifikasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
