import { create } from 'zustand'

// Sesuaikan dengan kebutuhan form/modal di Gudang Seragam
export type GlobalDialogType =
  | 'group-form'
  | 'category-form'
  | 'model-form'
  | 'variant-form'
  | 'stock-transaction-form'
  | 'delete-confirmation'
  | 'feature-lock'
  | 'import-csv-form'
  | 'export-dialog'

interface DialogInstance {
  id: string
  view: GlobalDialogType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (result?: any) => void
}

interface GlobalDialogStore {
  stack: DialogInstance[]
  openDialog: (
    view: GlobalDialogType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: { data?: any; onSuccess?: (result: any) => void }
  ) => void
  closeDialog: (id?: string) => void
}

export const useGlobalDialogStore = create<GlobalDialogStore>((set) => ({
  stack: [],
  
  openDialog: (view, options) =>
    set((state) => ({
      stack: [
        ...state.stack,
        {
          id: Math.random().toString(36).substring(7),
          view,
          data: options?.data,
          onSuccess: options?.onSuccess,
        },
      ],
    })),
    
  closeDialog: (id) =>
    set((state) => {
      // Jika diberikan ID spesifik, tutup dialog tersebut
      if (id) {
        return {
          stack: state.stack.filter((d) => d.id !== id),
        }
      }
      // Jika tidak ada ID, tutup dialog yang posisinya paling atas (terakhir dibuka)
      return {
        stack: state.stack.slice(0, -1),
      }
    }),
}))