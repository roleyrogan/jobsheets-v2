import { AccountEmailForm } from '@/features/account/AccountEmailForm'
import { AccountPasswordForm } from '@/features/account/AccountPasswordForm'
import { DeleteAccountSection } from '@/features/account/DeleteAccountSection'
import { PageTitle } from '@/components/PageTitle'
import { Separator } from '@/components/ui/separator'

export function Settings() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <PageTitle>Settings</PageTitle>
      <AccountEmailForm />
      <Separator />
      <AccountPasswordForm />
      <Separator />
      <DeleteAccountSection />
    </div>
  )
}
