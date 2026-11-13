const monthDay = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
})

const monthDayYear = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const monthShort = new Intl.DateTimeFormat('en-CA', { month: 'short' })

export function parseYmd(ymd: string): Date | null {
  const parts = ymd.split('-')
  if (parts.length !== 3) return null
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }
  return new Date(year, month - 1, day)
}

export function formatMonthDay(ymd: string): string {
  const date = parseYmd(ymd)
  return date ? monthDay.format(date) : ymd
}

export function formatMonthDayYear(ymd: string): string {
  const date = parseYmd(ymd)
  return date ? monthDayYear.format(date) : ymd
}

export function formatMonth(ymd: string): string {
  const date = parseYmd(ymd)
  return date ? monthShort.format(date) : ''
}

export function formatPercent(value: number | null): string {
  if (value === null) return '—'
  return `${Math.round(value)}%`
}

export function applicationWord(count: number): string {
  return count === 1 ? 'application' : 'applications'
}
