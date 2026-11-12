import { FunctionsHttpError } from '@supabase/supabase-js'
import { z } from 'zod'

import { supabase } from '@/lib/api/client'

const functionErrorBodySchema = z.object({
  error: z.string().min(1),
})

async function messageFromDeleteError(
  error: unknown,
  data: unknown,
): Promise<string> {
  const fromData = functionErrorBodySchema.safeParse(data)
  if (fromData.success) return fromData.data.error

  if (error instanceof FunctionsHttpError && error.context instanceof Response) {
    try {
      const body: unknown = await error.context.json()
      const parsed = functionErrorBodySchema.safeParse(body)
      if (parsed.success) return parsed.data.error
    } catch {
      // fall through to generic message
    }
  }

  if (error instanceof Error && error.message) return error.message
  return 'Failed to delete account'
}

export async function deleteAccount(): Promise<void> {
  const { data, error } = await supabase.functions.invoke('delete-account')

  if (error) {
    throw new Error(await messageFromDeleteError(error, data))
  }

  const fromData = functionErrorBodySchema.safeParse(data)
  if (fromData.success) {
    throw new Error(fromData.data.error)
  }

  const { error: signOutError } = await supabase.auth.signOut({
    scope: 'local',
  })
  if (signOutError) throw new Error(signOutError.message)
}
