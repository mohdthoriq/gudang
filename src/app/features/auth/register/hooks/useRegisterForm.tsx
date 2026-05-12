import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type RegisterFormData, RegisterSchema } from '../types/register.types'
import { useRegisterMutation } from './useRegisterMutation'

export function useRegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      full_name: '',
      phone: '',
      company_name: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useRegisterMutation()

  function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data)
  }

  return {
    form,
    isLoading: registerMutation.isPending,
    onSubmit,
  }
}
