import { useCallback, useEffect, useRef } from 'react'

import type { SampleRow } from '@/features/landing/sampleData'
import { cloneSampleRows } from '@/features/landing/sampleData'
import type { SortKey } from '@/features/landing/heroSort'

type DemoApi = {
  setSort: (key: SortKey, dir: 'asc' | 'desc') => void
  setRows: (rows: SampleRow[]) => void
  flashRow: (id: string) => void
  setStatus: (id: string, status: SampleRow['status']) => void
}

export function useHeroDemo(api: DemoApi) {
  const timers = useRef<number[]>([])
  const cancelled = useRef(false)
  const apiRef = useRef(api)

  useEffect(() => {
    apiRef.current = api
  }, [api])

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }, [])

  const cancel = useCallback(() => {
    cancelled.current = true
    clearTimers()
  }, [clearTimers])

  const play = useCallback(() => {
    clearTimers()
    cancelled.current = false
    apiRef.current.setRows(cloneSampleRows())
    apiRef.current.setSort('added', 'desc')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(
        window.setTimeout(() => {
          if (cancelled.current) return
          fn()
        }, ms),
      )
    }

    schedule(1800, () => apiRef.current.setSort('company', 'asc'))
    schedule(3400, () => {
      apiRef.current.setStatus('harbour', 'Interview')
      apiRef.current.flashRow('harbour')
    })
    schedule(5000, () => apiRef.current.setSort('added', 'desc'))
  }, [clearTimers])

  useEffect(() => {
    play()
    return clearTimers
    // Play once on mount; replay() is explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only demo
  }, [])

  return { cancel, replay: play }
}
