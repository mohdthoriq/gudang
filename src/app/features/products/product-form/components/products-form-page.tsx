'use client'

import { useWatch } from 'react-hook-form'
import {
  FinanceNumberType,
  type Unit,
  type Product,
  type ProductCategory,
} from '@/types'
import { CheckCircle2Icon, ChevronRight, Loader2, Upload } from 'lucide-react'
import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import {
  useCheckFinanceNumberQuery,
  useDefaultNumberingQuery,
} from '@/hooks/use-auto-numbering'
import { useDebounce } from '@/hooks/use-debounce'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormShortcutButton } from '@/components/forms/form-shortcut-button'
import { InputFieldNumberFormat } from '@/components/forms/input-field-number-format'
import { useProductCategoryQuery } from '@/features/product-categories/hooks/use-product-category-query'
import { useUnitsQuery } from '@/features/settings/units/hooks/use-units-query'
import { ImageThumbnail } from '../../../../components/forms/image-thumbnail'
import { useProductsForm } from '../hooks/use-products-form'

type ProductsFormContentProps = {
  currentRow?: Product | null
  onSuccess?: (data: Product) => void
  isModal?: boolean
}

export function ProductsFormContent({
  currentRow,
  onSuccess,
  isModal,
}: ProductsFormContentProps) {
  const { data: units } = useUnitsQuery()
  const { data: categories } = useProductCategoryQuery()
  const { data: productsAutoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.product_sku,
    enabled: !currentRow,
  })
  const { openDialog } = useGlobalDialogStore()

  const {
    form,
    onSubmit,
    fileInputRef,
    handleBoxClick,
    handleDragOver,
    handleDrop,
    uploadedFiles,
    removeFile,
    handleFileSelect,
    isSubmitting,
    existingImages,
    errorMessage,
  } = useProductsForm({
    currentRow,
    autoNumbering: productsAutoNumbering,
    onSuccess,
  })

  const { control, formState } = form

  const sku = useWatch({ control, name: 'sku' })
  const debouncedSku = useDebounce(sku, 500)

  const isOriginalNumber =
    !!debouncedSku && debouncedSku === (formState.defaultValues?.sku ?? '')

  const {
    data: checkResult,
    isFetching: isCheckingNumber,
    isError: hasCheckError,
  } = useCheckFinanceNumberQuery({
    type: FinanceNumberType.product_sku,
    number: debouncedSku,
  })

  const numberIsTaken =
    !isOriginalNumber &&
    checkResult &&
    (checkResult.exists === true || checkResult.available === false)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl>
                  <Input placeholder='Nama Produk' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sku'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='SKU-001' {...field} />
                    {isCheckingNumber && (
                      <div className='absolute top-1/2 right-2 -translate-y-1/2'>
                        <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                      </div>
                    )}
                  </div>
                </FormControl>
                {numberIsTaken || hasCheckError ? (
                  <p className='text-destructive text-[0.8rem] font-medium'>
                    {checkResult?.message ||
                      (hasCheckError
                        ? 'Gagal memeriksa nomor referensi'
                        : 'Nomor referensi sudah digunakan')}
                  </p>
                ) : (
                  <FormMessage />
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='unit_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Satuan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih satuan' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units?.data.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.code}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <FormShortcutButton
                      title='Tambah Satuan Baru'
                      onClick={() =>
                        openDialog('unit', {
                          onSuccess: (data: Unit) => {
                            if (data?.id) {
                              field.onChange(data.id)
                            }
                          },
                        })
                      }
                    />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='product_category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Pilih kategori' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.data.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <FormShortcutButton
                      title='Tambah Kategori Baru'
                      onClick={() =>
                        openDialog('product-category', {
                          onSuccess: (data: ProductCategory) => {
                            if (data?.id) {
                              field.onChange(data.id)
                            }
                          },
                        })
                      }
                    />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='purchase_price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Beli</FormLabel>
                <FormControl>
                  <InputFieldNumberFormat
                    placeholder='0'
                    value={field.value}
                    onValueChange={field.onChange}
                    prefix='Rp'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sale_price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Jual</FormLabel>
                <FormControl>
                  <InputFieldNumberFormat
                    placeholder='0'
                    value={field.value}
                    onValueChange={field.onChange}
                    prefix='Rp'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder='Deskripsi produk...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Untuk Sementara Fitur ini di disabled karena perlu ada research lanjutan -- Malfazakki */}
        {/* <FormField
          control={form.control}
          name='taxable'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Pajak</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}

        <Collapsible
          defaultOpen
          className='group/collapsible rounded-lg border transition-transform duration-500'
        >
          <CollapsibleTrigger asChild>
            <FormLabel className='cursor-pointer border-b p-4'>
              <ChevronRight className='mr-2 h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
              Gambar Produk
            </FormLabel>
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4'>
            <div
              className='border-border flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center'
              onClick={handleBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className='bg-muted mb-2 rounded-full p-3'>
                <Upload className='text-muted-foreground h-5 w-5' />
              </div>
              <p className='text-foreground text-sm font-medium'>
                Klik atau seret gambar ke area ini untuk mengunggah gambar
                produk
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Jumlah upload maksimal 10 gambar
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Tipe file: JPG, JPEG, GIF, WEBP
              </p>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>

            {(uploadedFiles.length > 0 || existingImages.length > 0) && (
              <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {existingImages.map((file, index) => (
                  <ImageThumbnail
                    key={`existing-${index}`}
                    file={file}
                    onRemove={() => removeFile(index, 'existing')}
                  />
                ))}
                {uploadedFiles.map((file, index) => (
                  <ImageThumbnail
                    key={`new-${index}`}
                    file={file}
                    onRemove={() => removeFile(index, 'new')}
                  />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {errorMessage && (
          <Alert variant='destructive' className='w-full'>
            <CheckCircle2Icon />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className='flex justify-end space-x-2'>
          {!isModal && (
            <Button
              type='button'
              variant='outline'
              onClick={() => history.back()}
            >
              Batal
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
            {isSubmitting
              ? 'Menyimpan...'
              : currentRow
                ? 'Update Produk'
                : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
