import { Loader2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { PERMISSION_KEY } from '@/constants/permissions'
import { useHasPermission } from '@/hooks/use-has-permission'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { useExpenseJournalsQuery } from '../hooks/use-expense-journals-query'

interface ExpenseJournalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseId: string
  expenseNumber: string
}

export function ExpenseJournalDialog({
  open,
  onOpenChange,
  expenseId,
  expenseNumber,
}: ExpenseJournalDialogProps) {
  const { data: journalResponse, isLoading } =
    useExpenseJournalsQuery(expenseId)

  const hasPermission = useHasPermission(PERMISSION_KEY.EXPENSE_JOURNAL)

  const journal = journalResponse?.data?.[0]
  const lines = journal?.journal_lines || []

  const totalDebit = lines.reduce((acc, line) => acc + (line.debit || 0), 0)
  const totalCredit = lines.reduce((acc, line) => acc + (line.credit || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-h-[90vh] sm:max-w-4xl'>
        <DialogHeader>
          <p className='text-muted-foreground text-sm'>Laporan Jurnal</p>
          <DialogTitle className='text-2xl font-bold'>
            Biaya {expenseNumber}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex h-40 items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        ) : lines.length === 0 ? (
          <div className='text-muted-foreground flex h-40 items-center justify-center'>
            Tidak ada data jurnal ditemukan.
          </div>
        ) : (
          <div
            className={cn(
              'overflow-auto rounded-md border',
              !hasPermission && 'relative'
            )}
          >
            <Table
              className={cn(
                !hasPermission && 'pointer-events-none opacity-100 blur-[2px]'
              )}
            >
              <TableHeader className='bg-muted/50'>
                <TableRow>
                  <TableHead className='p-2'>Akun</TableHead>
                  <TableHead className='p-2 text-right'>Debit</TableHead>
                  <TableHead className='p-2 text-right'>Kredit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className='p-4'>
                      <div className='text-primary font-medium'>
                        {line.account.code} {line.account.name}
                      </div>
                      {line.description && (
                        <div className='text-muted-foreground text-xs'>
                          {line.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(line.debit)}
                    </TableCell>
                    <TableCell className='p-4 text-right'>
                      {formatCurrency(line.credit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className='bg-muted/30 font-bold'>
                  <TableCell className='p-4'>Total</TableCell>
                  <TableCell className='p-4 text-right'>
                    {formatCurrency(totalDebit)}
                  </TableCell>
                  <TableCell className='p-4 text-right'>
                    {formatCurrency(totalCredit)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            {!hasPermission && (
              <UpgradePlanCard type='dialog' feature='Laporan Jurnal' />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
