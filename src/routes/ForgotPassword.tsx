import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Footer } from '@/components/Footer'
import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm'

export function ForgotPassword() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              We&apos;ll email you a link to reset it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
