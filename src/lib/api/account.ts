import { supabase } from '@/lib/api/client'

export async function deleteAccount(): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account')

  if (error) {
    throw new Error(error.message || 'Failed to delete account')
  }

  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof data.error === 'string' &&
    data.error
  ) {
    throw new Error(data.error)
  }

  const { error: signOutError } = await supabase.auth.signOut({
    scope: 'local',
  })
  if (signOutError) throw new Error(signOutError.message)
}
