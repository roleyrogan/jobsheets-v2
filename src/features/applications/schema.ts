import { z } from 'zod'

import { STATUSES, isStatus } from '@/lib/status'
import { normalizeUrl, safeExternalUrl } from '@/lib/urls'

const [firstStatus, ...restStatuses] = STATUSES.map((status) => status.value)
if (firstStatus === undefined) {
  throw new Error('STATUSES must not be empty')
}
const statusEnum = z.enum([firstStatus, ...restStatuses])

const emptyToNull = (max: number) =>
  z
    .string()
    .max(max)
    .transform((value) => {
      const trimmed = value.trim()
      return trimmed === '' ? null : trimmed
    })

export const applicationFormSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(120, 'Company must be at most 120 characters'),
  role: z
    .string()
    .trim()
    .min(1, 'Role is required')
    .max(160, 'Role must be at most 160 characters'),
  status: statusEnum.refine(isStatus, { message: 'Select a status' }),
  application_url: z.string().transform((raw, ctx) => {
    const trimmed = raw.trim()
    if (trimmed === '') return null
    const normalized = normalizeUrl(trimmed)
    const safe = safeExternalUrl(normalized)
    if (safe === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid link starting with http or https',
      })
      return z.NEVER
    }
    return safe
  }),
  location: emptyToNull(120),
  notes: emptyToNull(2000),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export type ApplicationFormInput = z.input<typeof applicationFormSchema>
