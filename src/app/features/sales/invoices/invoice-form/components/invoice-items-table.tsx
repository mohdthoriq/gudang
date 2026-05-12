import { Fragment, useMemo } from 'react'
import { type useForm } from 'react-hook-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProductsQuery } from '@/features/products/product-list/hooks/use-product-list-query'
import { useTaxesQuery } from '@/features/settings/taxes/hooks/use-taxes-query'
import type {
  CreateInvoiceFormData,
  InvoiceItemFormData,
  UpdateInvoiceFormData,
} from '../types/invoice-form.schema'
import { InvoiceItemRow } from './invoice-item-row'

type InvoiceItemsTableProps = {
  fields: InvoiceItemFormData[]
  form: ReturnType<
    typeof useForm<CreateInvoiceFormData | UpdateInvoiceFormData>
  >
  remove: (index: number) => void
}

export function InvoiceItemsTable({
  fields,
  form,
  remove,
}: InvoiceItemsTableProps) {
  const { data: products } = useProductsQuery({ page: 1, limit: 100 })
  const { data: taxes } = useTaxesQuery({ page: 1, limit: 100 })

  const productsData = useMemo(
    () => ({ data: products?.data || [] }),
    [products?.data]
  )
  const taxesData = useMemo(() => ({ data: taxes?.data || [] }), [taxes?.data])

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='h-8 px-2 text-xs'>Produk</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Deskripsi</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Qty</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Harga</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Disc</TableHead>
            <TableHead className='h-8 px-2 text-xs'>Pajak</TableHead>
            <TableHead className='h-8 px-2 text-right text-xs'>
              Total
            </TableHead>
            <TableHead className='h-8 px-2'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <Fragment key={`${field.product_id}-${index}`}>
              <InvoiceItemRow
                index={index}
                form={form}
                remove={remove}
                products={productsData}
                taxes={taxesData}
              />
            </Fragment>
          ))}
          {fields.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-muted-foreground h-24 text-center'
              >
                Belum ada item. Tambahkan item baru.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
