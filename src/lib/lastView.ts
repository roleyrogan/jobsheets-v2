const STORAGE_KEY = 'jobsheets:lastView'

export type AppView = 'sheet' | 'board' | 'overview'

export function isAppView(value: string): value is AppView {
  return value === 'sheet' || value === 'board' || value === 'overview'
}

export function getLastView(): AppView {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null && isAppView(stored)) return stored
  } catch {
    // localStorage may be unavailable
  }
  return 'sheet'
}

export function setLastView(view: AppView): void {
  try {
    localStorage.setItem(STORAGE_KEY, view)
  } catch {
    // localStorage may be unavailable
  }
}
