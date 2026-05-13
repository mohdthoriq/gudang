"use client"

import { useGlobalDialogStore } from '@/stores/global-dialog-store'
// Import komponen dialog Anda di sini

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
          case 'group-form': // Sesuai dengan tipe di store Anda
            return (
              /* <GroupActionDialog key={id} {...commonProps} currentRow={data} /> */
              null
            )
          case 'category-form':
            return (
               /* <CategoryActionDialog key={id} {...commonProps} currentRow={data} /> */
               null
            )
          case 'model-form':
            return (
              /* <ModelActionDialog key={id} {...commonProps} currentRow={data} /> */
              null
            )
          case 'variant-form':
            return (
              /* <VariantActionDialog key={id} {...commonProps} currentRow={data} /> */
              null
            )
          case 'stock-transaction-form':
            return (
              /* <StockTransactionDialog key={id} {...commonProps} currentRow={data} /> */
              null
            )
          default:
            return null
        }
      })}
    </>
  )
}
