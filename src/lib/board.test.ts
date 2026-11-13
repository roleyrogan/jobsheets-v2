import { describe, expect, it } from 'vitest'

import { groupByStatus } from '@/lib/board'
import { STATUSES } from '@/lib/status'
import type { Application } from '@/types/index'

function app(
  partial: Partial<Application> &
    Pick<Application, 'id' | 'company' | 'role' | 'status' | 'created_at'>,
): Application {
  return {
    user_id: 'user-1',
    application_url: null,
    location: null,
    notes: null,
    ...partial,
  }
}

describe('groupByStatus', () => {
  it('includes every status key on empty input', () => {
    const columns = groupByStatus([])
    for (const status of STATUSES) {
      expect(columns[status.value]).toEqual([])
    }
  })

  it('groups by status and maps unknown statuses via toStatus', () => {
    const columns = groupByStatus([
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Interview',
        created_at: '2026-03-01T12:00:00.000Z',
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Weird',
        created_at: '2026-02-01T12:00:00.000Z',
      }),
    ])

    expect(columns.Interview.map((row) => row.id)).toEqual([1])
    expect(columns.Applied.map((row) => row.id)).toEqual([2])
    expect(columns.Offer).toEqual([])
    expect(columns.Rejected).toEqual([])
  })

  it('sorts each column newest first by created_at', () => {
    const columns = groupByStatus([
      app({
        id: 1,
        company: 'Old',
        role: 'R',
        status: 'Applied',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
      app({
        id: 2,
        company: 'New',
        role: 'R',
        status: 'Applied',
        created_at: '2026-03-01T12:00:00.000Z',
      }),
      app({
        id: 3,
        company: 'Mid',
        role: 'R',
        status: 'Applied',
        created_at: '2026-02-01T12:00:00.000Z',
      }),
    ])

    expect(columns.Applied.map((row) => row.id)).toEqual([2, 3, 1])
  })

  it('does not mutate the input array or items', () => {
    const input = [
      app({
        id: 1,
        company: 'A',
        role: 'R',
        status: 'Applied',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
      app({
        id: 2,
        company: 'B',
        role: 'R',
        status: 'Applied',
        created_at: '2026-02-01T12:00:00.000Z',
      }),
    ]
    const snapshot = structuredClone(input)

    groupByStatus(input)

    expect(input).toEqual(snapshot)
  })
})
