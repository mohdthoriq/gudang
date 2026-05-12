import { CheckCircle2Icon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import type { useExpensesForm } from '../hooks/use-expenses-form'
import { ExpensesFormActions } from '../sections/form-actions'
import { ExpensesFormHeader } from '../sections/form-header'
import { ExpensesFormItems } from '../sections/form-items-table'
import { ExpensesFormSummary } from '../sections/form-summary'

interface ExpensesFormFallbackProps {
  expensesForm: ReturnType<typeof useExpensesForm>
}
export function ExpensesFormFallback({
  expensesForm,
}: ExpensesFormFallbackProps) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none mb-8 opacity-100 blur-[2px]'>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between'>
              {expensesForm.isEdit ? 'Edit Biaya' : 'Tambah Biaya'}
              <Button variant='link' onClick={() => history.back()}>
                Kembali
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...expensesForm.form}>
            <form
              onSubmit={expensesForm.form.handleSubmit(expensesForm.onSubmit)}
              className='space-y-8'
              id='expenses-form'
            >
              <ExpensesFormHeader />
              <div className='bg-border h-px' />
              <ExpensesFormItems />
              <ExpensesFormSummary />
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
      <UpgradePlanCard
        feature={expensesForm.isEdit ? 'Edit Biaya' : 'Tambah Biaya'}
      />
    </div>
  )
}
