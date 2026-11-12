import { useState } from 'react'

import { applicationsToCsv } from '@/lib/csv'
import { toLocalYmd } from '@/lib/dates'
import { downloadTextFile } from '@/lib/download'
import { useApplications } from '@/features/applications/queries'
import { useSession } from '@/features/auth/useSession'
import { DeleteAccountDialog } from '@/features/account/DeleteAccountDialog'
import { Button } from '@/components/ui/button'

export function DeleteAccountSection() {
  const { user } = useSession()
  const email = user?.email ?? ''
  const { data: applications = [] } = useApplications()
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleExport() {
    downloadTextFile(
      applicationsToCsv(applications),
      `jobsheets-${toLocalYmd()}.csv`,
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Delete account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently deletes your account and every application. This can&apos;t
          be undone. Export your data first if you want a copy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleExport}
          disabled={applications.length === 0}
        >
          {applications.length === 0
            ? 'Export'
            : `Export ${applications.length} applications`}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setDialogOpen(true)}
          disabled={!email}
        >
          Delete account
        </Button>
      </div>

      <DeleteAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        email={email}
      />
    </section>
  )
}
