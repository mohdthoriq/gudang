import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AuthPurpose, type ApiResponse } from '@/types';
import { toast } from 'sonner';
import { useAuthFlowStore } from '@/stores/auth-flow-store';
import apiClient from '@/lib/api-client';
import type { RegisterResponse, RegisterFormData } from '../types/register.types';


export function useRegisterMutation() {
  const navigate = useNavigate()
  const setAuthFlow = useAuthFlowStore((state) => state.setAuthFlow)

  return useMutation({
    mutationFn: async (
      credentials: RegisterFormData
    ): Promise<ApiResponse<RegisterResponse>> => {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        '/auth/register',
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'register-toast' })
    },
    onSuccess: async (_, variables) => {
      toast.dismiss('register-toast')

      toast.success('Pendaftaran berhasil! Silakan verifikasi email Anda.')

      setAuthFlow({
        email: variables.email,
        purpose: AuthPurpose.Registration,
      })

      try {
        await navigate({
          to: '/verify-email',
          search: {
            email: variables.email,
            purpose: AuthPurpose.Registration,
          },
          replace: true,
        })
      } catch {
        // Continue without navigation - user can manually navigate
      }
    },
    onError: (error) => {
      toast.dismiss('register-toast')
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ApiResponse
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((err) => {
            const message = typeof err === 'string' ? err : err.error
            toast.error(message)
          })
        } else {
          toast.error(errorData?.message || 'Pendaftaran gagal')
        }
      } else {
        toast.error('Pendaftaran gagal. Silakan lakukan ulang pendaftaran.')
      }
    },
  })
}