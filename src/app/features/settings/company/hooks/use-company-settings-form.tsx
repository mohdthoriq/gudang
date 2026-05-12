import { useEffect, useState } from 'react'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiResponse } from '@/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  companySettingsSchema,
  type CompanySettingsFormData,
} from '../types/company-settings.schema'
import {
  useCompanySettingsMutation,
  useUploadCompanyLogo,
} from './use-company-setting-mutation'
import { useCompanySettingsQuery } from './use-company-settings-query'

export function useCompanySettingsForm() {
  const company = useAuthStore((state) => state.auth.user?.company)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

  // Fetch company data from API
  const {
    data: companyData,
    isLoading: isLoadingCompany,
    isError,
  } = useCompanySettingsQuery(company?.id)

  const form = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: '',
      address: '',
      npwp: undefined,
      logo_url: '',
      email: '',
      phone: '',
    },
  })

  // Update form values when company data is loaded from API
  useEffect(() => {
    if (companyData) {
      form.reset({
        name: companyData.name || '',
        address: companyData.address || '',
        npwp: companyData.npwp || undefined,
        logo_url: companyData.logo_url || '',
        email: companyData.email || '',
        phone: companyData.phone || '',
      })
    }
  }, [companyData, form])

  // Show error toast if query fails
  useEffect(() => {
    if (isError) {
      toast.error('Gagal memuat data perusahaan')
    }
  }, [isError])

  const companySettingsMutation = useCompanySettingsMutation(company?.id || '')
  const uploadLogoMutation = useUploadCompanyLogo()

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo harus kurang dari 5MB')
      return
    }

    setUploadedFile(file)
    setLocalPreviewUrl(URL.createObjectURL(file))
    form.setValue('logo_url', 'pending-upload', { shouldDirty: true })
  }

  const removeLogo = () => {
    setUploadedFile(null)
    setLocalPreviewUrl(null)
    form.setValue('logo_url', '', { shouldDirty: true })
  }

  const previewUrl = localPreviewUrl || form.watch('logo_url')

  const errors = form.formState.errors
  const firstError = Object.values(errors)[0]
  const mutationError =
    companySettingsMutation.error || uploadLogoMutation.error
  const errorMessage =
    (mutationError
      ? (mutationError as AxiosError<ApiResponse>)?.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data'
      : null) ||
    (firstError ? firstError.message || 'Terjadi kesalahan pada input' : null)

  const onSubmit = async (data: CompanySettingsFormData) => {
    try {
      let finalLogoUrl = data.logo_url

      // 1. Upload logo if there's a new file
      if (uploadedFile) {
        const formData = new FormData()
        formData.append('logo', uploadedFile)

        const uploadResponse = await uploadLogoMutation.mutateAsync(formData)
        finalLogoUrl = uploadResponse.data?.data
      }

      // 2. Patch company profile with the final logo URL
      await companySettingsMutation.mutateAsync({
        ...data,
        logo_url: finalLogoUrl,
      })

      setUploadedFile(null)
      setLocalPreviewUrl(null)
      toast.success('Pengaturan perusahaan berhasil diperbarui')
    } catch (_) {
      // toast.error('Gagal memperbarui pengaturan perusahaan')
    }
  }

  return {
    form,
    onSubmit,
    isLoading:
      companySettingsMutation.isPending || uploadLogoMutation.isPending,
    isLoadingData: isLoadingCompany,
    errorMessage,
    reset: (data?: CompanySettingsFormData) => {
      form.reset(data)
      setLocalPreviewUrl(null)
      setUploadedFile(null)
    },
    previewUrl,
    handleLogoChange,
    removeLogo,
  }
}
