import { ProductCategoryActionDialog } from './product-category-action-dialog'
import { useProductCategories } from './product-category-provider'

export function ProductCategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductCategories()

  return (
    <>
      <ProductCategoryActionDialog
        key='product-category-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <ProductCategoryActionDialog
            key={`product-category-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
