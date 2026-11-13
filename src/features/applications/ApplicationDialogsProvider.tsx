import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { ApplicationDialog } from '@/features/applications/ApplicationDialog'
import { ImportDialog } from '@/features/applications/ImportDialog'
import {
  ApplicationDialogsContext,
} from '@/features/applications/useApplicationDialogs'
import type { Application } from '@/types/index'

export function ApplicationDialogsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)

  const openCreate = useCallback(() => {
    setEditing(null)
    setDialogOpen(true)
  }, [])

  const openImport = useCallback(() => {
    setImportOpen(true)
  }, [])

  const openEdit = useCallback((application: Application) => {
    setEditing(application)
    setDialogOpen(true)
  }, [])

  const value = useMemo(
    () => ({ openCreate, openImport, openEdit }),
    [openCreate, openImport, openEdit],
  )

  return (
    <ApplicationDialogsContext.Provider value={value}>
      {children}
      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={editing}
      />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </ApplicationDialogsContext.Provider>
  )
}
