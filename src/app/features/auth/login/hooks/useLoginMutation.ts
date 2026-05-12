import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { ApiResponse, LoginResponse } from '@/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import apiClient from '@/lib/api-client'
import type { LoginFormData } from '../types/login.types'

interface UseLoginMutationProps {
  onUnverifiedEmail?: (email: string) => void
}

export function useLoginMutation({
  onUnverifiedEmail,
}: UseLoginMutationProps = {}) {
  const { auth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (
      credentials: LoginFormData
    ): Promise<ApiResponse<LoginResponse>> => {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        credentials
      )
      return response.data
    },
    onMutate: () => {
      toast.loading('Loading...', { id: 'login-toast' })
    },
    onSuccess: async (data) => {
      toast.dismiss('login-toast')

      const loginData = data.data!
      auth.setTokens(loginData.accessToken, loginData.refreshToken)

      // Save user data (including menus and permissions) from login response
      auth.setUser(loginData)

      try {
        const response =
          await apiClient.get<ApiResponse<LoginResponse>>('/auth/me')

        const userData = response.data!.data!

        // Merge userData with existing loginData to ensure menus and permissions are preserved
        // if /auth/me doesn't return them
        auth.setUser({
          ...loginData,
          ...userData,
          menus:
            userData.menus && userData.menus.length > 0
              ? userData.menus
              : loginData.menus,
          permissions:
            userData.permissions && userData.permissions.length > 0
              ? userData.permissions
              : loginData.permissions,
        })

        const greetingsSubject = userData.user?.full_name
          ? userData.user.full_name
          : userData.user?.email

        if (
          userData.role?.name === 'Administrator' ||
          userData.role?.name === 'superadmin'
        ) {
          navigate({ to: '/', replace: true })
        } else {
          navigate({ to: '/settings/profile', replace: true })
        }

        toast.success(`Selamat datang kembali, ${greetingsSubject}!`)
      } catch {
        // If profile fetch fails, still show success
        toast.success('Login berhasil!')
      }
    },
    onError: (error, variables) => {
      toast.dismiss('login-toast')

      if (error instanceof AxiosError) {
        const errorCode = error.response?.data.code
        const errorMessage = error.response?.data.message

        if (errorCode === 401) {
          // Email not verified
          onUnverifiedEmail?.(variables.email)
          return
        }

        toast.error('Login gagal: ' + errorMessage)
      } else {
        toast.error('Login gagal: ' + error.message)
      }
    },
  })
}
