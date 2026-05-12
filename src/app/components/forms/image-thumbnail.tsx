import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ImageThumbnailProps = {
  file: File | string
  onRemove: () => void
}

export function ImageThumbnail({ file, onRemove }: ImageThumbnailProps) {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    const setImagePreview = () => {
      if (typeof file === 'string') {
        setPreview(file)
        return
      }
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    setImagePreview()
  }, [file])

  if (!preview) return null

  return (
    <Dialog>
      <div className='group bg-muted relative aspect-square overflow-hidden rounded-md border'>
        <DialogTrigger asChild>
          <div className='h-full w-full cursor-pointer'>
            <img
              src={preview}
              alt='Preview'
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
          </div>
        </DialogTrigger>
        <Button
          type='button'
          variant='destructive'
          size='icon'
          className='absolute top-2 right-2 z-10 h-7 w-7 rounded-sm opacity-0 transition-all duration-300 group-hover:opacity-100'
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
      <DialogContent className='overflow-hidden border-none bg-transparent p-0 shadow-none [&>button]:text-white'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Preview Gambar</DialogTitle>
        </DialogHeader>
        <div className='flex items-center justify-center'>
          <img
            src={preview}
            alt='Full Preview'
            className='w-auto rounded-lg object-contain'
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
