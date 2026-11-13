import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import type { Session, User } from '@supabase/supabase-js'

import {
  needsAuthClient,
  openedFromRecoveryLink,
  peekSignedIn,
} from '@/lib/api/authFlags'
import {
  SessionContext,
  type AuthStatus,
} from '@/features/auth/useSession'

export function SessionProvider() {
  const navigate = useNavigate()
  const location = useLocation()
  const authClientNeeded = needsAuthClient(location.pathname)

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [clientStatus, setClientStatus] = useState<AuthStatus>('loading')
  const [isRecovery, setIsRecovery] = useState(openedFromRecoveryLink)

  const status: AuthStatus = authClientNeeded
    ? clientStatus
    : peekSignedIn()
      ? 'signedIn'
      : 'signedOut'

  function clearRecovery() {
    setIsRecovery(false)
  }

  useEffect(() => {
    if (!authClientNeeded) return

    let active = true
    let unsubscribe = () => {}

    void import('@/lib/api/auth').then(({ onAuthStateChange }) => {
      if (!active) return
      const { subscription } = onAuthStateChange((event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
        setClientStatus(nextSession ? 'signedIn' : 'signedOut')

        if (event === 'PASSWORD_RECOVERY') {
          setIsRecovery(true)
          navigate('/reset-password', { replace: true })
        }

        if (event === 'SIGNED_OUT') {
          setIsRecovery(false)
          void import('@/lib/queryClient').then(({ queryClient }) => {
            queryClient.clear()
          })
        }
      })
      unsubscribe = () => subscription.unsubscribe()
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [authClientNeeded, navigate])

  return (
    <SessionContext.Provider
      value={{
        session: authClientNeeded ? session : null,
        user: authClientNeeded ? user : null,
        status,
        isRecovery,
        clearRecovery,
      }}
    >
      <Outlet />
    </SessionContext.Provider>
  )
}
