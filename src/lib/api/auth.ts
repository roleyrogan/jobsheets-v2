import type {
  AuthChangeEvent,
  Session,
  Subscription,
  User,
} from '@supabase/supabase-js'

import { supabase } from '@/lib/api/client'

export {
  authRedirectHadError,
  clearAuthHash,
  openedFromRecoveryLink,
} from '@/lib/api/authFlags'

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): { subscription: Subscription } {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)
  return { subscription }
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ session: Session; user: User }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(error.message)
  if (!data.session || !data.user) {
    throw new Error('Sign in failed. Please try again.')
  }
  return { session: data.session, user: data.user }
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ sessionCreated: boolean }> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return { sessionCreated: data.session != null }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

export async function updateEmail(newEmail: string): Promise<void> {
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${window.location.origin}/app/settings` },
  )
  if (error) throw new Error(error.message)
}

export async function verifyPassword(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (!error) return

  const isInvalidCredentials =
    error.code === 'invalid_credentials' ||
    (error.code == null && error.status === 400)

  if (isInvalidCredentials) {
    throw new Error('Current password is incorrect')
  }
  throw new Error(error.message)
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await verifyPassword(email, currentPassword)
  await updatePassword(newPassword)
}
