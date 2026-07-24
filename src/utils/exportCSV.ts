import type { Application } from '../types'

function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function fieldValue(value: string | null | undefined): string {
  return value ?? ''
}

function formatTodayFilenameDate(): string {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const year = today.getFullYear()
  return `${year}-${month}-${day}`
}

export function exportToCSV(applications: Application[]): void {
  const headers = [
    'Company',
    'Role',
    'Status',
    'Date Added',
    'Application URL',
    'Location',
    'Notes',
  ]

  const rows = applications.map(app =>
    [
      app.company,
      app.role,
      app.status,
      app.date,
      fieldValue(app.application_url),
      fieldValue(app.location),
      fieldValue(app.notes),
    ]
      .map(escapeCSVField)
      .join(',')
  )

  const csvContent = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `jobsheets-export-${formatTodayFilenameDate()}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
