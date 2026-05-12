import { useLocation, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
// import { PERMISSION_KEY } from '@/constants/permissions'
// import { PermissionGuard } from '@/components/permission-guard'
// import { WarehouseFormFallback } from './components/warehouses-fallback'
import { useWarehousesForm } from './hooks/use-warehouses-form'
import { WarehouseFormActions } from './section/warehouse-form-action'
import { WarehouseFormHeader } from './section/warehouse-form-header'
import { useWarehouseQuery } from './hooks/use-warehouses-query'

export default function WarehouseFormPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Ambil ID dari state route jika sedang mode Edit
  const currentRowId = (location.state as { currentRowId?: string })?.currentRowId

  // Fetch data gudang jika dalam mode edit
  const currentRow = useWarehouseQuery({ id: currentRowId })

  const warehouseForm = useWarehousesForm({
    currentRow: currentRow.data ?? undefined,
  })

//   Loading state saat mengambil data edit
  if (currentRowId && currentRow.isLoading) {
    return (
      <Card className='mb-8'>
        <CardContent className='flex h-40 items-center justify-center font-medium'>
          Memuat data gudang...
        </CardContent>
      </Card>
    )
  }

  return (
    // <PermissionGuard
    //   permission={
    //     warehouseForm.isEdit
    //       ? PERMISSION_KEY.WAREHOUSE_EDIT
    //       : PERMISSION_KEY.WAREHOUSE_ADD
    //   }
    //   fallback={<WarehouseFormFallback warehouseForm={warehouseForm} />}
    // >
      <Card className='mb-4'>
        <CardHeader className='pb-4'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold'>
                {warehouseForm.isEdit ? 'Edit Gudang' : 'Tambah Gudang Baru'}
              </h1>
              <Button
                variant='link'
                className='h-auto p-0'
                onClick={() => {
                  if (warehouseForm.isEdit) {
                    history.back()
                  } else {
                    navigate({ to: '/warehouses' })
                  }
                }}
              >
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...warehouseForm.form}>
            <form
              onSubmit={warehouseForm.form.handleSubmit(warehouseForm.onSubmit)}
              className='space-y-6'
              id='warehouse-form'
            >
              {/* Section Data Utama */}
              <WarehouseFormHeader form={warehouseForm.form} isEdit={warehouseForm.isEdit} />
              
              <div className='bg-border h-px' />

              {/* Tempat untuk WarehouseItemTable dan Summary nanti jika dibutuhkan */}

              {/* Section Tombol Aksi */}
              <WarehouseFormActions
                isEdit={warehouseForm.isEdit}
                isSubmitting={warehouseForm.isSubmitting}
                errorMessage={warehouseForm.errorMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    // </PermissionGuard>
  )
}