import { AuthShell } from '@/components/AuthShell'
import { SignupForm } from '@/features/auth/SignupForm'

export function Signup() {
  return (
    <AuthShell title="Create account">
      <SignupForm />
    </AuthShell>
  )
}
