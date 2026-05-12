import { create } from 'zustand'

export type GlobalDialogType =
  | 'contact'
  | 'product'
  | 'payment-term'
  | 'tag'
  | 'tax'
  | 'unit'
  | 'product-category'
  | 'account'
  | 'transfer'
  | 'expedition'

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
      if (id) {
        return {
          stack: state.stack.filter((d) => d.id !== id),
        }
      }
      // If no ID, close the top-most dialog
      return {
        stack: state.stack.slice(0, -1),
      }
    }),
}))
