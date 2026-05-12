import { useLocation, useNavigate } from '@tanstack/react-router'
import { FinanceNumberType } from '@/types'
import { CheckCircle2Icon } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useDefaultNumberingQuery } from '@/hooks/use-auto-numbering'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { AttachmentCard } from '@/components/forms/attachment-card'
import { PermissionGuard } from '@/components/permission-guard'
import { ExpensesFormFallback } from './components/expenses-form-fallback'
import { useExpensesForm } from './hooks/use-expenses-form'
import { useExpensesFormQuery } from './hooks/use-expenses-form-query'
import { ExpensesFormActions } from './sections/form-actions'
import { ExpensesFormHeader } from './sections/form-header'
import { ExpensesFormItems } from './sections/form-items-table'
import { ExpensesFormSummary } from './sections/form-summary'

export function ExpensesFormPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const currentRowId = (location.state as { currentRowId?: string })
    ?.currentRowId

  const currentRow = useExpensesFormQuery({ id: currentRowId })

  const { data: expensesAutoNumbering } = useDefaultNumberingQuery({
    type: FinanceNumberType.expense,
  })

  const expensesForm = useExpensesForm({
    currentRow: currentRow.data ?? undefined,
    autoNumbering: expensesAutoNumbering,
  })

  if (currentRowId && currentRow.isLoading) {
    return (
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Memuat data invoice...</CardTitle>
        </CardHeader>
        <CardContent className='flex h-40 items-center justify-center font-medium'>
          Mohon tunggu sebentar...
        </CardContent>
      </Card>
    )
  }

  return (
    <PermissionGuard
      permission={
        expensesForm.isEdit
          ? PERMISSION_KEY.EXPENSE_EDIT
          : PERMISSION_KEY.EXPENSE_ADD
      }
      fallback={<ExpensesFormFallback expensesForm={expensesForm} />}
    >
      <Card className='mb-4'>
        <CardHeader className='pb-4'>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold'>
                {expensesForm.isEdit ? 'Edit Biaya' : 'Tambah Biaya'}
              </h1>
              <Button
                variant='link'
                className='h-auto p-0'
                onClick={() => {
                  if (expensesForm.isEdit) {
                    history.back()
                  } else {
                    navigate({ to: '/expenses' })
                  }
                }}
              >
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...expensesForm.form}>
            <form
              onSubmit={expensesForm.form.handleSubmit(expensesForm.onSubmit)}
              className='space-y-6'
              id='expenses-form'
            >
              <ExpensesFormHeader />
              <div className='bg-border h-px' />
              <ExpensesFormItems />
              <div className='bg-border h-px' />

              <div className='flex flex-col items-start gap-6 md:flex-row'>
                <div className='w-full md:w-1/3'>
                  <FormField
                    control={expensesForm.form.control}
                    name='images'
                    render={({ field }) => (
                      <AttachmentCard
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className='ml-auto w-full md:w-2/3'>
                  <ExpensesFormSummary />
                </div>
              </div>
              {expensesForm.errorMessage && (
                <Alert variant='destructive' className='w-full'>
                  <CheckCircle2Icon />
                  <AlertTitle>Perhatian!</AlertTitle>
                  <AlertDescription>
                    {expensesForm.errorMessage}
                  </AlertDescription>
                </Alert>
              )}
              <ExpensesFormActions
                isEdit={expensesForm.isEdit}
                isSubmitting={expensesForm.isSubmitting}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}
