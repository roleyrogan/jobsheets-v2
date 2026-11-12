import { supabase } from '@/lib/api/client'
import { legacyDateString } from '@/lib/dates'
import type { ImportRow } from '@/lib/csv'
import type { Application } from '@/types/index'
import type { TablesInsert, TablesUpdate } from '@/types/database'

export type CreateApplicationValues = Omit<
  TablesInsert<'applications'>,
  'user_id' | 'date' | 'id' | 'created_at'
>

export type ApplicationUpdate = Omit<
  TablesUpdate<'applications'>,
  'user_id' | 'id'
>

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

export async function createApplication(
  userId: string,
  values: CreateApplicationValues,
): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...values,
      user_id: userId,
      date: legacyDateString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateApplication(
  id: number,
  patch: ApplicationUpdate,
): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteApplication(id: number): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

const IMPORT_CHUNK_SIZE = 200

export async function createApplications(
  userId: string,
  rows: ImportRow[],
): Promise<number> {
  let inserted = 0

  for (let index = 0; index < rows.length; index += IMPORT_CHUNK_SIZE) {
    const chunk = rows.slice(index, index + IMPORT_CHUNK_SIZE).map((row) => ({
      user_id: userId,
      company: row.company,
      role: row.role,
      status: row.status,
      application_url: row.application_url,
      location: row.location,
      notes: row.notes,
      created_at: row.created_at,
      date: legacyDateString(new Date(row.created_at)),
    }))

    const { error } = await supabase.from('applications').insert(chunk)
    if (error) {
      throw new Error(
        `Inserted ${inserted} of ${rows.length} before failure: ${error.message}`,
      )
    }
    inserted += chunk.length
  }

  return inserted
}
