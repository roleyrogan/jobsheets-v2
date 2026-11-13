import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import { updatePassword } from '@/lib/api/auth'
import { useSession } from '@/features/auth/useSession'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FieldErrors = Partial<Record<'password' | 'confirmPassword', string>>

export function ResetPasswordForm() {
  const { status, isRecovery, clearRecovery } = useSession()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (status === 'loading') {
    return (
      <p className="text-sm text-ink-2" role="status">
        Loading…
      </p>
    )
  }

  if (status === 'signedOut') {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertDescription>
            This reset link is invalid or has expired.{' '}
            <Link
              to="/forgot-password"
              className="hover:underline hover:underline-offset-4"
            >
              Request a new one
            </Link>
            .
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!isRecovery) {
    return <Navigate to="/app/settings" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    const parsed = schema.safeParse({ password, confirmPassword })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key === 'password' || key === 'confirmPassword') {
          next[key] = issue.message
        }
      }
      setFieldErrors(next)
      return
    }

    setFieldErrors({})
    setPending(true)
    try {
      await updatePassword(parsed.data.password)
      clearRecovery()
      toast.success('Password updated')
      navigate('/app', { replace: true })
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not update password',
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          disabled={pending}
        />
        {fieldErrors.password ? (
          <p className="text-sm text-destructive">{fieldErrors.password}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-confirm">Confirm password</Label>
        <Input
          id="reset-confirm"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          disabled={pending}
        />
        {fieldErrors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  )
}
