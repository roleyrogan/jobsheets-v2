import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { ApplicationDialog } from '@/features/applications/ApplicationDialog'
import {
  ApplicationDialogsContext,
} from '@/features/applications/useApplicationDialogs'
import type { Application } from '@/types/index'

const ImportDialog = lazy(async () => {
  const mod = await import('@/features/applications/ImportDialog')
  return { default: mod.ImportDialog }
})

function rememberFocusTarget(): HTMLElement | null {
  const active = document.activeElement
  return active instanceof HTMLElement ? active : null
}

export function ApplicationDialogsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const openCreate = useCallback(() => {
    restoreFocusRef.current = rememberFocusTarget()
    setEditing(null)
    setDialogOpen(true)
  }, [])

  const openImport = useCallback(() => {
    setImportOpen(true)
  }, [])

  const openEdit = useCallback((application: Application) => {
    restoreFocusRef.current = rememberFocusTarget()
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
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          const target = restoreFocusRef.current
          restoreFocusRef.current = null
          target?.focus()
        }}
      />
      {importOpen ? (
        <Suspense fallback={null}>
          <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
        </Suspense>
      ) : null}
    </ApplicationDialogsContext.Provider>
  )
}
