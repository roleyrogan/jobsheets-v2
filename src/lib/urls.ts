export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return trimmed
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

export function safeExternalUrl(value: string | null): string | null {
  if (value == null || value.trim() === '') return null
  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href
    }
    return null
  } catch {
    return null
  }
}
