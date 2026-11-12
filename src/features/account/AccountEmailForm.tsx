import { useState, type FormEvent } from 'react'
import { z } from 'zod'

import { updateEmail } from '@/lib/api/auth'
import { useSession } from '@/features/auth/useSession'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AccountEmailForm() {
  const { user } = useSession()
  const currentEmail = user?.email ?? ''
  const [newEmail, setNewEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)
    setConfirmMessage(null)

    const schema = z
      .object({
        email: z.email('Enter a valid email'),
      })
      .refine(
        (data) => data.email.trim().toLowerCase() !== currentEmail.toLowerCase(),
        { message: 'New email must be different from your current email', path: ['email'] },
      )

    const parsed = schema.safeParse({ email: newEmail.trim() })
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Invalid email')
      return
    }

    setFieldError(null)
    setPending(true)
    try {
      await updateEmail(parsed.data.email)
      setConfirmMessage(
        `We sent a confirmation link to ${parsed.data.email}. Your email changes once you confirm it.`,
      )
      setNewEmail('')
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not update email',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Email</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Current email:{' '}
          <span className="text-foreground">{currentEmail || '—'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {serverError ? (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}

        {confirmMessage ? (
          <Alert>
            <AlertDescription>{confirmMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-new-email">New email</Label>
          <Input
            id="settings-new-email"
            type="email"
            autoComplete="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            aria-invalid={Boolean(fieldError)}
            disabled={pending || !currentEmail}
          />
          {fieldError ? (
            <p className="text-sm text-destructive">{fieldError}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={pending || !currentEmail} className="w-fit">
          {pending ? 'Sending…' : 'Change email'}
        </Button>
      </form>
    </section>
  )
}
