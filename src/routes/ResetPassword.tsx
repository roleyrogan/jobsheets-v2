import { AuthShell } from '@/components/AuthShell'
import { ResetPasswordForm } from '@/features/auth/ResetPasswordForm'

export function ResetPassword() {
  return (
    <AuthShell title="Reset password">
      <ResetPasswordForm />
    </AuthShell>
  )
}
