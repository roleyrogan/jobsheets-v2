import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'

const CELL = 48

export function useHeroCursor() {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [enabled, setEnabled] = useState(false)
  const lastCell = useRef('')

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    function sync() {
      const on = !coarse.matches && !reduce.matches
      setEnabled(on)
      if (!on) {
        lastCell.current = ''
        setCursor(null)
      }
    }
    sync()
    coarse.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      coarse.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!enabled) return
      const rect = event.currentTarget.getBoundingClientRect()
      const gx = Math.floor((event.clientX - rect.left) / CELL)
      const gy = Math.floor((event.clientY - rect.top) / CELL)
      const key = `${gx},${gy}`
      if (key === lastCell.current) return
      lastCell.current = key
      setCursor({ x: gx * CELL + 1, y: gy * CELL + 1 })
    },
    [enabled],
  )

  function onMouseLeave() {
    lastCell.current = ''
    setCursor(null)
  }

  return { cursor, onMouseMove, onMouseLeave }
}
