import { useState, type FormEvent } from 'react'

import {
  applicationFormSchema,
  type ApplicationFormInput,
  type ApplicationFormValues,
} from '@/features/applications/schema'
import { ApplicationFormFields } from '@/features/applications/ApplicationFormFields'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type ApplicationFormProps = {
  mode: 'create' | 'edit'
  defaultValues: ApplicationFormInput
  onSubmit: (values: ApplicationFormValues) => Promise<void>
}

type FieldErrors = Partial<Record<keyof ApplicationFormInput, string>>

export function ApplicationForm({
  mode,
  defaultValues,
  onSubmit,
}: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationFormInput>(defaultValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function updateField<K extends keyof ApplicationFormInput>(
    key: K,
    value: ApplicationFormInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    const parsed = applicationFormSchema.safeParse(values)
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (
          key === 'company' ||
          key === 'role' ||
          key === 'status' ||
          key === 'application_url' ||
          key === 'location' ||
          key === 'notes'
        ) {
          next[key] = issue.message
        }
      }
      setFieldErrors(next)
      return
    }

    setFieldErrors({})
    setPending(true)
    try {
      await onSubmit(parsed.data)
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not save application',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {serverError ? (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <ApplicationFormFields
        values={values}
        errors={fieldErrors}
        pending={pending}
        onChange={updateField}
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? 'Saving…'
          : mode === 'create'
            ? 'Add application'
            : 'Save changes'}
      </Button>
    </form>
  )
}
