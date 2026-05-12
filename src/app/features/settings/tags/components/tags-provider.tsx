import {
  useState,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  createContext,
} from 'react'
import type { PaginationMeta, Tag } from '@/types'
import useDialogState from '@/hooks/use-dialog-state'
import { useTagsQuery, type TagsQueryParams } from '../hooks/use-tags-query'

type TagsDialogType = 'edit' | 'add'

type TagsContextType = {
  open: TagsDialogType | null
  setOpen: (str: TagsDialogType | null) => void
  currentRow: Tag | null
  setCurrentRow: Dispatch<SetStateAction<Tag | null>>
  tagsData: Tag[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  paginationParams?: TagsQueryParams
}

// eslint-disable-next-line react-refresh/only-export-components
export const TagsContext = createContext<TagsContextType | null>(null)

export function TagsProvider({
  children,
  paginationParams,
}: {
  children: ReactNode
  paginationParams?: TagsQueryParams
}) {
  const [open, setOpen] = useDialogState<TagsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tag | null>(null)

  const {
    data: tagsData,
    isLoading: isLoadingTags,
    isError: isErrorTags,
  } = useTagsQuery(paginationParams)

  const tagsProviderValues = {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    tagsData: tagsData?.data ?? [],
    pagination: tagsData?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    },
    isLoading: isLoadingTags,
    isError: isErrorTags,
    paginationParams,
  }

  return <TagsContext value={tagsProviderValues}>{children}</TagsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTags = () => {
  const tagsContext = useContext(TagsContext)

  if (!tagsContext) {
    throw new Error('useTags has to be used within <TagsContext>')
  }

  return tagsContext
}
