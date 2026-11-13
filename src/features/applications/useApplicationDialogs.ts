import { createContext, useContext } from 'react'

import type { Application } from '@/types/index'

export type ApplicationDialogsContextValue = {
  openCreate: () => void
  openImport: () => void
  openEdit: (application: Application) => void
}

export const ApplicationDialogsContext =
  createContext<ApplicationDialogsContextValue | null>(null)

export function useApplicationDialogs(): ApplicationDialogsContextValue {
  const ctx = useContext(ApplicationDialogsContext)
  if (!ctx) {
    throw new Error(
      'useApplicationDialogs must be used within ApplicationDialogsProvider',
    )
  }
  return ctx
}
