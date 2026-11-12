import { describe, expect, it } from 'vitest'

import { applicationsToCsv, parseApplicationsCsv } from '@/lib/csv'
import type { Application } from '@/types/index'

function app(
  partial: Partial<Application> &
    Pick<Application, 'id' | 'company' | 'role' | 'status' | 'created_at'>,
): Application {
  return {
    user_id: 'user-1',
    date: '01/01/2026',
    application_url: null,
    location: null,
    notes: null,
    ...partial,
  }
}

describe('applicationsToCsv', () => {
  it('includes expected headers, BOM, and local YYYY-MM-DD dates', () => {
    const csv = applicationsToCsv([
      app({
        id: 1,
        company: 'Acme',
        role: 'Eng',
        status: 'Applied',
        created_at: '2026-03-15T18:00:00.000Z',
      }),
    ])

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toContain(
      'Company,Role,Status,Date Added,Application URL,Location,Notes',
    )
    expect(csv).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('guards CSV injection and quotes special notes', () => {
    const csv = applicationsToCsv([
      app({
        id: 1,
        company: '=SUM(1)',
        role: '+1',
        status: 'Applied',
        created_at: '2026-01-01T12:00:00.000Z',
        location: '-1',
        notes: 'line1\nline2, "quoted"',
        application_url: '@x',
      }),
    ])

    expect(csv).toContain("'=SUM(1)")
    expect(csv).toContain("'+1")
    expect(csv).toContain("'-1")
    expect(csv).toContain("'@x")
    expect(csv).toContain('"line1\nline2, ""quoted"""')
  })
})

describe('parseApplicationsCsv', () => {
  it('round-trips export into an empty account', () => {
    const original = app({
      id: 1,
      company: 'Shopify',
      role: 'Frontend',
      status: 'Interview',
      application_url: 'https://example.com/job',
      location: 'Toronto',
      notes: 'hello',
      created_at: '2026-02-10T17:00:00.000Z',
    })
    const csv = applicationsToCsv([original])
    const result = parseApplicationsCsv(csv, [])

    expect(result.skipped).toEqual([])
    expect(result.ready).toHaveLength(1)
    const row = result.ready[0]
    expect(row?.company).toBe(original.company)
    expect(row?.role).toBe(original.role)
    expect(row?.status).toBe(original.status)
    expect(row?.application_url).toBe(original.application_url)
    expect(row?.location).toBe(original.location)
    expect(row?.notes).toBe(original.notes)
    expect(row?.created_at.slice(0, 10)).toBe(
      new Date(original.created_at).toISOString().slice(0, 10),
    )
  })

  it('accepts old-app headers and aliases', () => {
    const csv = [
      'Company,Role,Status,Date Added,Application URL,Location,Notes,Extra',
      'Acme,Eng,Applied,03/15/2026,https://a.com,NYC,hi,ignore-me',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready).toHaveLength(1)
    expect(result.ready[0]?.company).toBe('Acme')
  })

  it('accepts case-insensitive alias headers', () => {
    const csv = [
      'employer,title,stage,applied on,link,location,notes',
      'Beta,PM,Offer,2026-01-02,https://b.com,Remote,note',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready[0]?.company).toBe('Beta')
    expect(result.ready[0]?.role).toBe('PM')
    expect(result.ready[0]?.status).toBe('Offer')
  })

  it('skips when Company or Role column is missing', () => {
    const result = parseApplicationsCsv('Company,Notes\nAcme,hi\n', [])
    expect(result.skipped).toEqual([
      { line: 1, reason: 'Missing Company or Role column' },
    ])
  })

  it('skips invalid and javascript URLs', () => {
    const csv = [
      'Company,Role,Status,Application URL',
      'A,R,Applied,not a url',
      'B,R,Applied,javascript:alert(1)',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready).toEqual([])
    expect(result.skipped.map((s) => s.line)).toEqual([2, 3])
  })

  it('warns on unknown status and invalid date', () => {
    const csv = [
      'Company,Role,Status,Date Added',
      'A,R,Ghosted,not-a-date',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready).toHaveLength(1)
    expect(result.ready[0]?.status).toBe('Applied')
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        {
          line: 2,
          message: "Unknown status 'Ghosted', imported as Applied",
        },
        {
          line: 2,
          message: "Invalid date 'not-a-date', used today",
        },
      ]),
    )
  })

  it('accepts both date formats', () => {
    const csv = [
      'Company,Role,Date Added',
      'A,R,2026-04-01',
      'B,R,04/02/2026',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready).toHaveLength(2)
    expect(result.warnings).toEqual([])
  })

  it('skips duplicates from existing and within file', () => {
    const existing = [
      app({
        id: 1,
        company: 'Acme',
        role: 'Eng',
        status: 'Applied',
        application_url: 'https://a.com',
        created_at: '2026-01-01T12:00:00.000Z',
      }),
    ]
    const csv = [
      'Company,Role,Application URL',
      'Acme,Eng,https://a.com',
      'Acme,Eng,https://a.com',
      'Other,Role,https://b.com',
    ].join('\n')
    const result = parseApplicationsCsv(csv, existing)
    expect(result.ready).toHaveLength(1)
    expect(result.ready[0]?.company).toBe('Other')
    expect(
      result.skipped.filter((s) => s.reason === 'Duplicate of an existing application'),
    ).toHaveLength(2)
  })

  it('ignores blank rows and keeps spreadsheet line numbers', () => {
    const csv = [
      'Company,Role',
      'A,R',
      '',
      'B,R2',
    ].join('\n')
    const result = parseApplicationsCsv(csv, [])
    expect(result.ready.map((r) => r.company)).toEqual(['A', 'B'])
  })

  it('rejects files with more than 1000 data rows', () => {
    const lines = ['Company,Role']
    for (let i = 0; i < 1001; i += 1) {
      lines.push(`C${i},R${i}`)
    }
    const result = parseApplicationsCsv(lines.join('\n'), [])
    expect(result.skipped).toEqual([
      { line: 1, reason: 'File has more than 1,000 rows' },
    ])
  })
})
