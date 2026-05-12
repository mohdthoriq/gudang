import { CheckCircle2Icon, Loader2, Save, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useCompanySettingsForm } from '../hooks/use-company-settings-form'
import { CompanySettingsSkeleton } from './company-settings-skeleton'

export function CompanySettingsForm() {
  const {
    form,
    onSubmit,
    isLoading,
    isLoadingData,
    errorMessage,
    previewUrl,
    handleLogoChange,
    removeLogo,
  } = useCompanySettingsForm()

  const canEdit = useHasPermission(PERMISSION_KEY.SETTINGS_COMPANY_EDIT)
  const canView = useHasPermission(PERMISSION_KEY.SETTINGS_COMPANY_VIEW)

  // Show loading skeleton while fetching data
  if (isLoadingData) {
    return <CompanySettingsSkeleton />
  }

  return (
    <div className={cn(!canView && 'relative')}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'space-y-6',
            !canView && 'pointer-events-none blur-[4px]'
          )}
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan nama perusahaan'
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormDescription>Nama resmi perusahaan Anda</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Perusahaan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan email perusahaan'
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    Email resmi yang digunakan untuk korespondensi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='Masukkan nomor telepon perusahaan'
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormDescription>
                    Nomor telepon resmi perusahaan Anda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <div className='relative'>
                        <Textarea
                          placeholder='Masukkan alamat lengkap perusahaan'
                          className='min-h-[100px] resize-none'
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={!canEdit}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Alamat lengkap kantor atau lokasi perusahaan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='npwp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPWP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan NPWP perusahaan'
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={!canEdit}
                    />
                  </FormControl>
                  <FormDescription>NPWP perusahaan Anda</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='logo_url'
              render={() => (
                <FormItem>
                  <FormLabel>Logo Perusahaan</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-6'>
                      <Avatar className='border-muted-foreground/25 h-24 w-24 rounded-lg border-2 border-dashed'>
                        <AvatarImage
                          src={previewUrl || ''}
                          alt='Logo Perusahaan'
                          className='object-cover'
                        />
                        <AvatarFallback className='bg-muted text-muted-foreground rounded-lg'>
                          {isLoading ? (
                            <Loader2 className='h-6 w-6 animate-spin' />
                          ) : (
                            <UploadCloud className='h-8 w-8 opacity-50' />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <label
                            htmlFor='logo-upload'
                            className={cn(
                              'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring relative flex h-9 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                              isLoading && 'pointer-events-none opacity-50'
                            )}
                          >
                            <UploadCloud className='mr-2 h-4 w-4' />
                            Pilih Logo
                            <input
                              id='logo-upload'
                              type='file'
                              className='sr-only'
                              accept='image/*'
                              onChange={handleLogoChange}
                              disabled={!canEdit || isLoading}
                            />
                          </label>

                          {previewUrl && (
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='text-destructive hover:bg-destructive/10 hover:text-destructive h-9'
                              onClick={removeLogo}
                              disabled={!canEdit || isLoading}
                            >
                              <X className='mr-2 h-4 w-4' />
                              Hapus
                            </Button>
                          )}
                        </div>
                        <p className='text-muted-foreground text-[0.8rem]'>
                          Maksimal 5MB. Format: JPG, PNG, atau WEBP.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {errorMessage && (
            <Alert variant='destructive' className='w-full'>
              <CheckCircle2Icon />
              <AlertTitle>Perhatian!</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className='flex justify-end pt-4'>
            <Button type='submit' disabled={isLoading || !canEdit}>
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Form>
      {!canView && <UpgradePlanCard feature='Edit Data Perusahaan' />}
    </div>
  )
}
