import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type FormShortcutButtonProps = {
  onClick: () => void
  title: string
}
export function FormShortcutButton({
  onClick,
  title,
}: FormShortcutButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          className='w-full justify-start font-normal'
          onClick={onClick}
        >
          <Plus className='mr-2 h-4 w-4' />
          {title}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}
