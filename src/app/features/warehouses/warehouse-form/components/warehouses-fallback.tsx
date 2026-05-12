import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import type { useWarehousesForm } from '../hooks/use-warehouses-form'
import { WarehouseFormActions } from '../section/warehouse-form-action'
import { WarehouseFormHeader } from '../section/warehouse-form-header'

export function WarehouseFormFallback({
  warehouseForm,
}: {
  warehouseForm: ReturnType<typeof useWarehousesForm>
}) {
  return (
    <div className='relative'>
      {/* Form yang di-blur dan tidak bisa di-klik */}
      <Card className='pointer-events-none mb-4 opacity-100 blur-[2px]'>
        <CardHeader className='pb-4'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold'>
                {warehouseForm.isEdit ? 'Edit Gudang' : 'Tambah Gudang Baru'}
              </h1>
              <Button variant='link' onClick={() => history.back()} className='h-auto p-0'>
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
              <WarehouseFormHeader form={warehouseForm.form} isEdit={warehouseForm.isEdit} />
              
              <div className='bg-border h-px' />

              <WarehouseFormActions
                isEdit={warehouseForm.isEdit}
                isSubmitting={warehouseForm.isSubmitting}
                errorMessage={warehouseForm.errorMessage}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Kartu Upgrade muncul melayang di atas efek blur */}
      <UpgradePlanCard
        feature={
          warehouseForm.isEdit
            ? 'Edit Data Gudang'
            : 'Tambah Gudang Baru'
        }
      />
    </div>
  )
}
