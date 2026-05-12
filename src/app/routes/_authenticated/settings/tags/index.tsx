import { createFileRoute } from '@tanstack/react-router'
import Tags from '@/features/settings/tags'

export const Route = createFileRoute('/_authenticated/settings/tags/')({
  component: Tags,
})
