import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import { changePassword } from '@/lib/api/auth'
import { useSession } from '@/features/auth/useSession'
import { AccountPasswordFields } from '@/features/account/AccountPasswordFields'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from your current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FieldErrors = Partial<
  Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>
>

export function AccountPasswordForm() {
  const { user } = useSession()
  const email = user?.email ?? ''
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    const parsed = schema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (
          key === 'currentPassword' ||
          key === 'newPassword' ||
          key === 'confirmPassword'
        ) {
          next[key] = issue.message
        }
      }
      setFieldErrors(next)
      return
    }

    if (!email) {
      setServerError('No email associated with this account')
      return
    }

    setFieldErrors({})
    setPending(true)
    try {
      await changePassword(
        email,
        parsed.data.currentPassword,
        parsed.data.newPassword,
      )
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not update password',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Change the password you use to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {serverError ? (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}

        <AccountPasswordFields
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          errors={fieldErrors}
          pending={pending}
          onChange={(field, value) => {
            if (field === 'currentPassword') setCurrentPassword(value)
            if (field === 'newPassword') setNewPassword(value)
            if (field === 'confirmPassword') setConfirmPassword(value)
          }}
        />

        <Button type="submit" disabled={pending || !email} className="w-fit">
          {pending ? 'Updating…' : 'Update password'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        <Link to="/forgot-password" className="underline underline-offset-4">
          Forgot your current password?
        </Link>
      </p>
    </section>
  )
}
