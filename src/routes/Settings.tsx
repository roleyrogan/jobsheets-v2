import { AccountEmailForm } from '@/features/account/AccountEmailForm'
import { AccountPasswordForm } from '@/features/account/AccountPasswordForm'
import { DeleteAccountSection } from '@/features/account/DeleteAccountSection'
import { Separator } from '@/components/ui/separator'

export function Settings() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      <AccountEmailForm />
      <Separator />
      <AccountPasswordForm />
      <Separator />
      <DeleteAccountSection />
    </div>
  )
}
