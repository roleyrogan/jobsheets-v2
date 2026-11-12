import { STATUSES, isStatus } from '@/lib/status'
import { FormField } from '@/features/applications/FormField'
import type { ApplicationFormInput } from '@/features/applications/schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ApplicationFormFieldsProps = {
  values: ApplicationFormInput
  errors: Partial<Record<keyof ApplicationFormInput, string>>
  pending: boolean
  onChange: <K extends keyof ApplicationFormInput>(
    key: K,
    value: ApplicationFormInput[K],
  ) => void
}

export function ApplicationFormFields({
  values,
  errors,
  pending,
  onChange,
}: ApplicationFormFieldsProps) {
  return (
    <>
      <FormField label="Company" htmlFor="company" error={errors.company}>
        <Input
          id="company"
          value={values.company}
          onChange={(e) => onChange('company', e.target.value)}
          aria-invalid={Boolean(errors.company)}
          disabled={pending}
          autoComplete="organization"
        />
      </FormField>

      <FormField label="Role" htmlFor="role" error={errors.role}>
        <Input
          id="role"
          value={values.role}
          onChange={(e) => onChange('role', e.target.value)}
          aria-invalid={Boolean(errors.role)}
          disabled={pending}
        />
      </FormField>

      <FormField label="Status" htmlFor="status" error={errors.status}>
        <Select
          value={values.status}
          onValueChange={(value) => {
            if (isStatus(value)) onChange('status', value)
          }}
          disabled={pending}
        >
          <SelectTrigger
            id="status"
            className="w-full"
            aria-invalid={Boolean(errors.status)}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Posting URL"
        htmlFor="application_url"
        error={errors.application_url}
      >
        <Input
          id="application_url"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.application_url}
          onChange={(e) => onChange('application_url', e.target.value)}
          aria-invalid={Boolean(errors.application_url)}
          disabled={pending}
        />
      </FormField>

      <FormField label="Location" htmlFor="location" error={errors.location}>
        <Input
          id="location"
          value={values.location}
          onChange={(e) => onChange('location', e.target.value)}
          aria-invalid={Boolean(errors.location)}
          disabled={pending}
        />
      </FormField>

      <FormField label="Notes" htmlFor="notes" error={errors.notes}>
        <Textarea
          id="notes"
          value={values.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          aria-invalid={Boolean(errors.notes)}
          disabled={pending}
          rows={3}
        />
      </FormField>
    </>
  )
}
