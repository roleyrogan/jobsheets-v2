import { supabase } from '@/lib/api/client'
import { chunk } from '@/lib/chunk'
import type { ImportRow } from '@/lib/csv'
import type { Status } from '@/lib/status'
import type { Application, ApplicationEvent } from '@/types/index'
import type { TablesInsert, TablesUpdate } from '@/types/database'

const BULK_CHUNK_SIZE = 200

export type CreateApplicationValues = Omit<
  TablesInsert<'applications'>,
  'user_id' | 'id' | 'created_at'
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

export async function listApplicationEvents(
  userId: string,
): Promise<ApplicationEvent[]> {
  const { data, error } = await supabase
    .from('application_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

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

export async function updateStatuses(
  ids: number[],
  status: Status,
): Promise<number> {
  if (ids.length === 0) return 0

  let updated = 0
  for (const idChunk of chunk(ids, BULK_CHUNK_SIZE)) {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .in('id', idChunk)
    if (error) {
      throw new Error(
        `Updated ${updated} of ${ids.length} before an error: ${error.message}`,
      )
    }
    updated += idChunk.length
  }

  return updated
}

export async function deleteApplications(ids: number[]): Promise<number> {
  if (ids.length === 0) return 0

  let deleted = 0
  for (const idChunk of chunk(ids, BULK_CHUNK_SIZE)) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .in('id', idChunk)
    if (error) {
      throw new Error(
        `Deleted ${deleted} of ${ids.length} before an error: ${error.message}`,
      )
    }
    deleted += idChunk.length
  }

  return deleted
}

export async function createApplications(
  userId: string,
  rows: ImportRow[],
): Promise<number> {
  let inserted = 0

  for (const rowChunk of chunk(rows, BULK_CHUNK_SIZE)) {
    const payload = rowChunk.map((row) => ({
      user_id: userId,
      company: row.company,
      role: row.role,
      status: row.status,
      application_url: row.application_url,
      location: row.location,
      notes: row.notes,
      created_at: row.created_at,
    }))

    const { error } = await supabase.from('applications').insert(payload)
    if (error) {
      throw new Error(
        `Inserted ${inserted} of ${rows.length} before failure: ${error.message}`,
      )
    }
    inserted += rowChunk.length
  }

  return inserted
}
