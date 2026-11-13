import { AuthShell } from '@/components/AuthShell'
import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm'

export function ForgotPassword() {
  return (
    <AuthShell title="Forgot password">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
