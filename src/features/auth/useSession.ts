import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut'

export type SessionContextValue = {
  session: Session | null
  user: User | null
  status: AuthStatus
  isRecovery: boolean
  clearRecovery: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return value
}
