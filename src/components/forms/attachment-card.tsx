import React from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

type AttachmentCardProps = {
  value?: File[]
  onChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
  className?: string
  title?: string
  disabled?: boolean
}

export function AttachmentCard({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*,.pdf,.doc,.docx',
  className,
  title = 'Lampiran',
  disabled = false,
}: AttachmentCardProps) {
  const currentTotalSize = value.reduce((acc, file) => acc + file.size, 0)
  const isMaxReached = value.length >= maxFiles || currentTotalSize >= maxSize

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return

    let validFiles: File[] = []
    const currentTotalSize = value.reduce((acc, file) => acc + file.size, 0)

    selectedFiles.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(
          `Ukuran file ${file.name} melebihi maksimal ${maxSize / 1024 / 1024}MB.`
        )
      } else {
        validFiles.push(file)
      }
    })

    if (value.length + validFiles.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} file yang diizinkan.`)
      const remainingSlots = Math.max(0, maxFiles - value.length)
      validFiles = validFiles.slice(0, remainingSlots)
    }

    const finalTotalSize =
      currentTotalSize + validFiles.reduce((acc, file) => acc + file.size, 0)
    if (finalTotalSize > maxSize) {
      toast.error(
        `Total ukuran file tidak boleh melebihi ${maxSize / 1024 / 1024}MB.`
      )
      return
    }

    if (validFiles.length > 0) {
      onChange?.([...value, ...validFiles])
    }

    e.target.value = ''
  }

  const removeFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange?.(newFiles)
  }

  return (
    <Card className={cn('w-full border shadow-none', className)}>
      <CardHeader className='border-border border-b pb-3'>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-4'>
        {value.length > 0 && (
          <div className='space-y-2'>
            {value.map((file: File, index: number) => (
              <div
                key={`${file.name}-${index}`}
                className='flex items-center justify-between rounded-md border p-2 text-sm'
              >
                <span className='max-w-[80%] truncate'>{file.name}</span>
                <button
                  type='button'
                  disabled={disabled}
                  onClick={() => removeFile(index)}
                  className='text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50'
                >
                  <X className='size-4' />
                </button>
              </div>
            ))}
          </div>
        )}

        {!isMaxReached && (
          <div>
            <Label
              htmlFor='attachment-upload'
              className={cn(
                'hover:border-primary hover:bg-muted/50 flex h-20 w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed bg-transparent px-4 transition',
                disabled && 'pointer-events-none cursor-not-allowed opacity-50'
              )}
            >
              <div className='flex flex-col items-center space-y-1'>
                <Plus className='text-muted-foreground size-5' />
                <span className='text-muted-foreground text-xs font-medium'>
                  Unggah File (Maks {maxFiles} file)
                </span>
              </div>
              <input
                id='attachment-upload'
                type='file'
                multiple
                className='hidden'
                disabled={disabled}
                onChange={handleFileChange}
                accept={accept}
              />
            </Label>
            <p className='text-muted-foreground mt-2 text-center text-[10px] text-balance'>
              Maks. ukuran {maxSize / 1024 / 1024}MB.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
