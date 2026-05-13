// src/app/lib/handle-server-error.ts
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function handleServerError(error: unknown) {
  // Tampilkan detail error di console untuk keperluan debugging developer
  // eslint-disable-next-line no-console
  console.error("API Error Detail:", error);

  let errMsg = 'Terjadi kesalahan pada sistem!';

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Data tidak ditemukan.';
  }

  // Jika error berasal dari request API (Axios)
  if (error instanceof AxiosError) {
    // KUNCI PERUBAHAN: Kita ambil dari .message, bukan .title
    const backendMessage = error.response?.data?.message;
    
    if (backendMessage) {
      errMsg = backendMessage;
    } else if (error.message) {
      // Fallback ke pesan bawaan Axios (misal: "Network Error")
      errMsg = error.message;
    }
  }

  // Munculkan popup notifikasi error berwarna merah
  toast.error(errMsg);
}
