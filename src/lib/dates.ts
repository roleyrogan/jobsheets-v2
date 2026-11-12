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
