const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function daysAgo(iso: string, now: Date = new Date()): number {
  const then = new Date(iso).getTime()
  const diffMs = now.getTime() - then
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/** Legacy MM/DD/YYYY for the NOT NULL `date` text column. Written on create only. */
export function legacyDateString(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${month}/${day}/${year}`
}
