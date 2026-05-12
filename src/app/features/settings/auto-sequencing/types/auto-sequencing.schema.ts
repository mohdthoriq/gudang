import { z } from 'zod'

export const autoSequencingFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  format_only: z.string().min(1, 'Format is required'),
  sequence: z.number().min(1, 'Current number is required'),
  reset_every: z.number().min(0, 'Reset every is required'),
})

export type AutoSequencingFormValues = z.infer<typeof autoSequencingFormSchema>
