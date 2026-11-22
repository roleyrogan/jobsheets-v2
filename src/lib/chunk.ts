export function chunk<T>(items: T[], size: number): T[][] {
  if (size < 1) {
    throw new Error('chunk size must be at least 1')
  }
  if (items.length === 0) return []

  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }
  return result
}
