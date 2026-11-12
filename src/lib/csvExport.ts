import Papa from 'papaparse'

import { toLocalYmd } from '@/lib/dates'
import type { Application } from '@/types/index'

export const CSV_HEADERS = [
  'Company',
  'Role',
  'Status',
  'Date Added',
  'Application URL',
  'Location',
  'Notes',
] as const

const UTF8_BOM = '\uFEFF'

function guardCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`
  }
  return value
}

export function applicationsToCsv(apps: Application[]): string {
  const rows = apps.map((app) => [
    guardCsvCell(app.company),
    guardCsvCell(app.role),
    guardCsvCell(app.status),
    guardCsvCell(toLocalYmd(new Date(app.created_at))),
    guardCsvCell(app.application_url ?? ''),
    guardCsvCell(app.location ?? ''),
    guardCsvCell(app.notes ?? ''),
  ])

  return (
    UTF8_BOM +
    Papa.unparse({
      fields: [...CSV_HEADERS],
      data: rows,
    })
  )
}
