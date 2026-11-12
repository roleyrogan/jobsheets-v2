import Papa from 'papaparse'

import { isStatus } from '@/lib/status'
import { applicationFormSchema } from '@/lib/applicationSchema'
import {
  cell,
  duplicateKey,
  isBlankRecord,
  lineNumberAt,
  mapHeaders,
  matchStatus,
  papaRowToLine,
  parseImportDate,
} from '@/lib/csvImportHelpers'
import type { Application } from '@/types/index'
import type { Status } from '@/lib/status'

export type ImportRow = {
  company: string
  role: string
  status: Status
  application_url: string | null
  location: string | null
  notes: string | null
  created_at: string
}

export type ParseApplicationsCsvResult = {
  ready: ImportRow[]
  skipped: { line: number; reason: string }[]
  warnings: { line: number; message: string }[]
}

export function parseApplicationsCsv(
  text: string,
  existing: Application[],
): ParseApplicationsCsvResult {
  const skipped: ParseApplicationsCsvResult['skipped'] = []
  const warnings: ParseApplicationsCsvResult['warnings'] = []
  const ready: ImportRow[] = []

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: false,
  })

  const quoteError = parsed.errors.find((error) => error.type === 'Quotes')
  if (quoteError) {
    const line =
      typeof quoteError.index === 'number'
        ? lineNumberAt(text, quoteError.index)
        : papaRowToLine(quoteError.row)
    return {
      ready: [],
      skipped: [
        {
          line,
          reason:
            'Unclosed quote near this line — fix the file and try again',
        },
      ],
      warnings: [],
    }
  }

  for (const error of parsed.errors) {
    warnings.push({
      line: papaRowToLine(error.row),
      message: error.message,
    })
  }

  const fields = parsed.meta.fields ?? []
  const headerMap = mapHeaders(fields)
  if (!headerMap) {
    return {
      ready: [],
      skipped: [{ line: 1, reason: 'Missing Company or Role column' }],
      warnings: [],
    }
  }

  if (parsed.data.length > 1000) {
    return {
      ready: [],
      skipped: [{ line: 1, reason: 'File has more than 1,000 rows' }],
      warnings: [],
    }
  }

  const seen = new Set(
    existing.map((app) =>
      duplicateKey(app.company, app.role, app.application_url),
    ),
  )

  parsed.data.forEach((row, index) => {
    const line = index + 2
    if (isBlankRecord(row)) return

    const statusMatch = matchStatus(cell(row, headerMap.status))
    if (statusMatch.warning) {
      warnings.push({ line, message: statusMatch.warning })
    }

    const dateMatch = parseImportDate(cell(row, headerMap.date))
    if (dateMatch.warning) {
      warnings.push({ line, message: dateMatch.warning })
    }

    const formParsed = applicationFormSchema.safeParse({
      company: cell(row, headerMap.company),
      role: cell(row, headerMap.role),
      status: statusMatch.status,
      application_url: cell(row, headerMap.application_url),
      location: cell(row, headerMap.location),
      notes: cell(row, headerMap.notes),
    })

    if (!formParsed.success) {
      skipped.push({
        line,
        reason: formParsed.error.issues[0]?.message ?? 'Invalid row',
      })
      return
    }

    if (!isStatus(formParsed.data.status)) {
      skipped.push({ line, reason: 'Invalid status' })
      return
    }

    const key = duplicateKey(
      formParsed.data.company,
      formParsed.data.role,
      formParsed.data.application_url,
    )
    if (seen.has(key)) {
      skipped.push({ line, reason: 'Duplicate of an existing application' })
      return
    }
    seen.add(key)

    ready.push({
      ...formParsed.data,
      status: formParsed.data.status,
      created_at: dateMatch.iso,
    })
  })

  return { ready, skipped, warnings }
}
