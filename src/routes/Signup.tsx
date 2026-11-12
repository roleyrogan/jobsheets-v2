import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Footer } from '@/components/Footer'
import { SignupForm } from '@/features/auth/SignupForm'

export function Signup() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Start tracking applications in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
