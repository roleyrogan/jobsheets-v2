import { AuthShell } from '@/components/AuthShell'
import { LoginForm } from '@/features/auth/LoginForm'

export function Login() {
  return (
    <AuthShell title="Sign in">
      <LoginForm />
    </AuthShell>
  )
}
