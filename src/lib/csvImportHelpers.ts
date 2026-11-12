import { STATUSES, type Status } from '@/lib/status'
import { normalizeUrl, safeExternalUrl } from '@/lib/urls'

export type CanonicalRow = {
  company: string
  role: string
  status: string
  date: string
  application_url: string
  location: string
  notes: string
}

const HEADER_ALIASES: Record<string, keyof CanonicalRow> = {
  company: 'company',
  employer: 'company',
  role: 'role',
  title: 'role',
  position: 'role',
  status: 'status',
  stage: 'status',
  'date added': 'date',
  date: 'date',
  'applied on': 'date',
  applied: 'date',
  'application url': 'application_url',
  url: 'application_url',
  link: 'application_url',
  posting: 'application_url',
  location: 'location',
  notes: 'notes',
}

export function normalizeHeader(value: string): string {
  return value.trim().toLowerCase()
}

export function isBlankRecord(row: Record<string, unknown>): boolean {
  return Object.values(row).every((value) => {
    if (value == null) return true
    return String(value).trim() === ''
  })
}

function canonicalUrl(url: string | null): string {
  if (url == null || url.trim() === '') return ''
  const safe = safeExternalUrl(normalizeUrl(url.trim()))
  return (safe ?? url.trim()).toLowerCase()
}

export function duplicateKey(
  company: string,
  role: string,
  url: string | null,
): string {
  return [
    company.trim().toLowerCase(),
    role.trim().toLowerCase(),
    canonicalUrl(url),
  ].join('|')
}

export function matchStatus(raw: string): { status: Status; warning?: string } {
  const trimmed = raw.trim()
  if (trimmed === '') return { status: 'Applied' }

  const matched = STATUSES.find(
    (status) => status.value.toLowerCase() === trimmed.toLowerCase(),
  )
  if (matched) return { status: matched.value }

  return {
    status: 'Applied',
    warning: `Unknown status '${trimmed}', imported as Applied`,
  }
}

function noonLocalIso(year: number, month: number, day: number): string | null {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date.toISOString()
}

export function parseImportDate(raw: string): {
  iso: string
  warning?: string
} {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return { iso: new Date().toISOString() }
  }

  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (ymd) {
    const iso = noonLocalIso(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]))
    if (iso) return { iso }
  }

  const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (mdy) {
    const iso = noonLocalIso(Number(mdy[3]), Number(mdy[1]), Number(mdy[2]))
    if (iso) return { iso }
  }

  return {
    iso: new Date().toISOString(),
    warning: `Invalid date '${trimmed}', used today`,
  }
}

export function mapHeaders(
  fields: string[],
): Partial<Record<keyof CanonicalRow, string>> | null {
  const map: Partial<Record<keyof CanonicalRow, string>> = {}
  for (const field of fields) {
    const canonical = HEADER_ALIASES[normalizeHeader(field)]
    if (canonical && map[canonical] === undefined) {
      map[canonical] = field
    }
  }
  if (map.company === undefined || map.role === undefined) return null
  return map
}

export function cell(
  row: Record<string, unknown>,
  header: string | undefined,
): string {
  if (!header) return ''
  const value = row[header]
  if (value == null) return ''
  return String(value)
}
