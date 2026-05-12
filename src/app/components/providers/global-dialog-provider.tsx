import { useGlobalDialogStore } from '@/stores/global-dialog-store'
import type {
  Account,
  CashBankTransactionDetail,
  Contact,
  Expedition,
  PaymentTerm,
  Product,
  ProductCategory,
  Tag,
  Tax,
  Unit,
} from '@/types'
import { AccountsActionDialog } from '@/features/account/components/account-action-dialog'
import { CashBankListActionDialog } from '@/features/cash-bank/cash-bank-list/components/cash-bank-list-action-dialog'
import { ContactsActionDialog } from '@/features/contacts/components/contacts-action-dialog'
import { ProductCategoryActionDialog } from '@/features/product-categories/components/product-category-action-dialog'
import { ProductActionDialog } from '@/features/products/product-list/components/products-action-dialog'
import { PaymentTermsActionDialog } from '@/features/settings/payment-terms/components/payment-terms-action-dialog'
import { TagsActionDialog } from '@/features/settings/tags/components/tags-action-dialog'
import { TaxesActionDialog } from '@/features/settings/taxes/components/taxes-action-dialog'
import { UnitsActionDialog } from '@/features/settings/units/components/units-action-dialog'
import { ExpeditionsActionDialog } from '@/features/settings/expeditions/components/expeditions-action-dialog'

export function GlobalDialogProvider() {
  const { stack, closeDialog } = useGlobalDialogStore()

  if (stack.length === 0) return null

  return (
    <>
      {stack.map((dialog) => {
        const { id, view, data, onSuccess } = dialog

        const commonProps = {
          open: true,
          onOpenChange: (open: boolean) => !open && closeDialog(id),
          onSuccess: (result?: unknown) => {
            onSuccess?.(result)
            closeDialog(id)
          },
        }

        switch (view) {
          case 'contact':
            return (
              <ContactsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Contact}
              />
            )
          case 'product':
            return (
              <ProductActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Product}
              />
            )
          case 'payment-term':
            return (
              <PaymentTermsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as PaymentTerm}
              />
            )
          case 'tag':
            return (
              <TagsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Tag}
              />
            )
          case 'tax':
            return (
              <TaxesActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Tax}
              />
            )
          case 'unit':
            return (
              <UnitsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Unit}
              />
            )
          case 'product-category':
            return (
              <ProductCategoryActionDialog
                key={id}
                {...commonProps}
                currentRow={data as ProductCategory}
              />
            )
          case 'account':
            return (
              <AccountsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as (Partial<Account> & { category_id?: string }) | null}
              />
            )
          case 'transfer':
            return (
              <CashBankListActionDialog
                key={id}
                {...commonProps}
                currentRow={data as CashBankTransactionDetail}
              />
            )
          case 'expedition':
            return (
              <ExpeditionsActionDialog
                key={id}
                {...commonProps}
                currentRow={data as Expedition}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
