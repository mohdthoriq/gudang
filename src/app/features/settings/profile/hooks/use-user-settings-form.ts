import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  userSettingsSchema,
  type UserSettingsFormData,
} from '../types/user-settings.schema'
import { useUserSettingsMutation } from './use-user-settings-mutation'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types'

export function useUserSettingsForm() {
  const user = useAuthStore((state) => state.auth.user)

  const userSettingsMutation = useUserSettingsMutation(user?.user?.id || '')

  const form = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      full_name: user?.user.full_name || '',
      email: user?.user.email || '',
      phone: user?.user.phone || '',
      old_password: undefined,
      new_password: undefined,
      confirm_password: undefined,
    },
  })

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError = userSettingsMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: UserSettingsFormData) => {
    try {
      await userSettingsMutation.mutateAsync(data)

      toast.success('Profil berhasil diperbarui')

      // Reset password fields after successful update
      form.setValue('old_password', undefined)
      form.setValue('new_password', undefined)
      form.setValue('confirm_password', undefined)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating user settings:', error)
      toast.error('Gagal memperbarui profil')
    }
  }

  return {
    form,
    onSubmit,
    isLoading: userSettingsMutation.isPending,
    errorMessage,
  }
}
