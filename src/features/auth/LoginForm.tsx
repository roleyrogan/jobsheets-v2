import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import { signIn } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const locationStateSchema = z.object({
  from: z.object({
    pathname: z.string(),
  }),
})

function redirectPathFromState(state: unknown): string {
  const parsed = locationStateSchema.safeParse(state)
  if (!parsed.success) return '/app'
  const { pathname } = parsed.data.from
  if (pathname === '/app' || pathname.startsWith('/app/')) {
    return pathname
  }
  return '/app'
}

type FieldErrors = Partial<Record<'email' | 'password', string>>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key === 'email' || key === 'password') {
          next[key] = issue.message
        }
      }
      setFieldErrors(next)
      return
    }

    setFieldErrors({})
    setPending(true)
    try {
      await signIn(parsed.data.email, parsed.data.password)
      toast.success('Signed in')
      navigate(redirectPathFromState(location.state), { replace: true })
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Sign in failed',
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
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          disabled={pending}
        />
        {fieldErrors.email ? (
          <p className="text-sm text-destructive">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          disabled={pending}
        />
        {fieldErrors.password ? (
          <p className="text-sm text-destructive">{fieldErrors.password}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-sm text-ink-2">
        <Link to="/forgot-password" className="hover:underline hover:underline-offset-4">
          Forgot password?
        </Link>
      </p>
      <p className="text-sm text-ink-2">
        No account?{' '}
        <Link to="/signup" className="hover:underline hover:underline-offset-4">
          Sign up
        </Link>
      </p>
    </form>
  )
}
