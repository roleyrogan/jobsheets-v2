import { initialAuthHash } from '@/lib/api/authHash'

const authHashParams = new URLSearchParams(
  initialAuthHash.startsWith('#') ? initialAuthHash.slice(1) : initialAuthHash,
)

export const openedFromRecoveryLink = authHashParams.get('type') === 'recovery'

export const authRedirectHadError =
  authHashParams.has('error') || authHashParams.has('error_code')

export function clearAuthHash(): void {
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
}

/** LocalStorage peek — no supabase-js. Used on marketing pages only. */
export function peekSignedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)
      if (!key?.startsWith('sb-') || !key.endsWith('-auth-token')) continue
      const raw = window.localStorage.getItem(key)
      if (!raw) continue
      const parsed: unknown = JSON.parse(raw)
      if (
        parsed &&
        typeof parsed === 'object' &&
        'access_token' in parsed &&
        typeof parsed.access_token === 'string' &&
        parsed.access_token.length > 0
      ) {
        return true
      }
    }
  } catch {
    return false
  }
  return false
}

export function needsAuthClient(pathname: string): boolean {
  return (
    pathname.startsWith('/app') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  )
}
