import { describe, expect, it } from 'vitest'

import { normalizeUrl, safeExternalUrl } from '@/lib/urls'

describe('normalizeUrl', () => {
  it('prepends https when there is no scheme', () => {
    expect(normalizeUrl('example.com/job')).toBe('https://example.com/job')
  })

  it('keeps an existing http scheme', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('keeps an existing https scheme', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('trims whitespace', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com')
  })
})

describe('safeExternalUrl', () => {
  it('accepts http and https', () => {
    expect(safeExternalUrl('https://example.com/job')).toBe(
      'https://example.com/job',
    )
    expect(safeExternalUrl('http://example.com')).toBe('http://example.com/')
  })

  it('rejects javascript, data, mailto, and garbage', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull()
    expect(safeExternalUrl('data:text/html,hi')).toBeNull()
    expect(safeExternalUrl('mailto:a@b.com')).toBeNull()
    expect(safeExternalUrl('not a url')).toBeNull()
  })

  it('returns null for empty values', () => {
    expect(safeExternalUrl(null)).toBeNull()
    expect(safeExternalUrl('')).toBeNull()
    expect(safeExternalUrl('   ')).toBeNull()
  })
})
