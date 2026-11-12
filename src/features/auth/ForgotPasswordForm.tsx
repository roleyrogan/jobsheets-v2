import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import { requestPasswordReset } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const schema = z.object({
  email: z.email('Enter a valid email'),
})

const SUCCESS_MESSAGE =
  'If an account exists for that email, we sent a reset link.'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    const parsed = schema.safeParse({ email })
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Invalid email')
      return
    }

    setFieldError(null)
    setPending(true)
    try {
      await requestPasswordReset(parsed.data.email)
      setDone(true)
      toast.success('Check your email')
    } catch (error) {
      // Don't reveal whether the email is registered for "user not found"
      // style failures; still surface rate-limit / config errors.
      const message =
        error instanceof Error ? error.message : 'Request failed'
      const lower = message.toLowerCase()
      if (
        lower.includes('not found') ||
        lower.includes('no user') ||
        lower.includes('unable to validate')
      ) {
        setDone(true)
        toast.success('Check your email')
      } else {
        setServerError(message)
      }
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          <AlertDescription>{SUCCESS_MESSAGE}</AlertDescription>
        </Alert>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {serverError ? (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldError)}
          disabled={pending}
        />
        {fieldError ? (
          <p className="text-sm text-destructive">{fieldError}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Sending…' : 'Send reset link'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
