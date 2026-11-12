import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'

import { onAuthStateChange } from '@/lib/api/auth'
import {
  SessionContext,
  type AuthStatus,
} from '@/features/auth/useSession'

export function SessionProvider() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const { subscription } = onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setStatus(nextSession ? 'signedIn' : 'signedOut')

      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password', { replace: true })
      }

      if (event === 'SIGNED_OUT') {
        queryClient.clear()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, queryClient])

  return (
    <SessionContext.Provider value={{ session, user, status }}>
      <Outlet />
    </SessionContext.Provider>
  )
}
