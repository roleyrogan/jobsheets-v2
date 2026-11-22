import { describe, expect, it } from 'vitest'

import { chunk } from '@/lib/chunk'

describe('chunk', () => {
  it('returns an empty array for an empty input', () => {
    expect(chunk([], 200)).toEqual([])
  })

  it('splits an exact multiple into equal chunks', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('puts the remainder in a final smaller chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns one chunk when size is larger than the array', () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]])
  })

  it('throws when size is less than 1', () => {
    expect(() => chunk([1], 0)).toThrow('chunk size must be at least 1')
    expect(() => chunk([1], -1)).toThrow('chunk size must be at least 1')
  })
})
