import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Footer } from '@/components/Footer'
import { ResetPasswordForm } from '@/features/auth/ResetPasswordForm'

export function ResetPassword() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
