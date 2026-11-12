import { supabase } from '@/lib/api/client'
import type { Application } from '@/types/index'

export async function listApplications(
  userId: string,
): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
