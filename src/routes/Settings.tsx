import { AccountEmailForm } from '@/features/account/AccountEmailForm'
import { AccountPasswordForm } from '@/features/account/AccountPasswordForm'
import { DeleteAccountSection } from '@/features/account/DeleteAccountSection'
import { PageTitle } from '@/components/PageTitle'

export function Settings() {
  return (
    <div className="flex w-full max-w-[640px] flex-col">
      <PageTitle className="mb-8">Settings</PageTitle>
      <AccountEmailForm />
      <div className="my-8 border-t border-rule" />
      <AccountPasswordForm />
      <div className="my-8 border-t border-rule" />
      <DeleteAccountSection />
    </div>
  )
}
