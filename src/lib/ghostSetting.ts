const STORAGE_KEY = 'jobsheets:ghostAfterDays'
const DEFAULT_DAYS = 21
const MIN_DAYS = 7
const MAX_DAYS = 90

function isValidGhostDays(value: number): boolean {
  return (
    Number.isInteger(value) && value >= MIN_DAYS && value <= MAX_DAYS
  )
}

export function getGhostAfterDays(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) return DEFAULT_DAYS
    const parsed = Number(stored)
    if (!isValidGhostDays(parsed)) return DEFAULT_DAYS
    return parsed
  } catch {
    return DEFAULT_DAYS
  }
}

export function setGhostAfterDays(days: number): void {
  if (!isValidGhostDays(days)) return
  try {
    localStorage.setItem(STORAGE_KEY, String(days))
  } catch {
    // localStorage may be unavailable
  }
}
