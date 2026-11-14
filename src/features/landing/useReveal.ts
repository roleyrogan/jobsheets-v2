import { useCallback, useEffect, useRef, type RefCallback } from 'react'

type RevealOptions = {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

function prefersStaticReveal(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof IntersectionObserver === 'undefined'
  )
}

function markVisible(el: HTMLElement) {
  el.classList.remove('landing-reveal-pending')
  el.classList.add('landing-reveal-visible')
}

function isAlreadyInView(
  el: HTMLElement,
  threshold: number,
  rootMargin?: string,
): boolean {
  const root = expandRoot(rootMargin)
  const rect = el.getBoundingClientRect()
  const visibleHeight =
    Math.min(rect.bottom, root.bottom) - Math.max(rect.top, root.top)
  const visibleWidth =
    Math.min(rect.right, root.right) - Math.max(rect.left, root.left)
  if (visibleHeight <= 0 || visibleWidth <= 0) return false
  const ratio =
    (visibleHeight * visibleWidth) / Math.max(rect.height * rect.width, 1)
  return ratio >= threshold
}

function expandRoot(rootMargin?: string): {
  top: number
  right: number
  bottom: number
  left: number
} {
  const viewport = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  }
  if (!rootMargin) return viewport
  const parts = rootMargin.trim().split(/\s+/).map(parseMargin)
  const top = parts[0] ?? 0
  const right = parts[1] ?? top
  const bottom = parts[2] ?? top
  const left = parts[3] ?? right
  return {
    top: viewport.top - top,
    right: viewport.right + right,
    bottom: viewport.bottom + bottom,
    left: viewport.left - left,
  }
}

function parseMargin(value: string): number {
  if (value.endsWith('px')) return Number.parseFloat(value)
  if (value.endsWith('%')) {
    return (Number.parseFloat(value) / 100) * window.innerHeight
  }
  return Number.parseFloat(value) || 0
}

/** Observes the element when it mounts (callback ref). Safe for late mounts. */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
): RefCallback<T> {
  const { threshold = 0.15, rootMargin, enabled = true } = options
  const observerRef = useRef<IntersectionObserver | null>(null)
  const nodeRef = useRef<T | null>(null)

  const cleanup = useCallback(() => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (nodeRef.current) {
      nodeRef.current.classList.remove(
        'landing-reveal-pending',
        'landing-reveal-visible',
      )
    }
    nodeRef.current = null
  }, [])

  useEffect(() => cleanup, [cleanup])

  return useCallback(
    (node: T | null) => {
      cleanup()
      if (!node || !enabled) return

      nodeRef.current = node

      if (prefersStaticReveal()) {
        markVisible(node)
        return
      }

      if (isAlreadyInView(node, threshold, rootMargin)) {
        markVisible(node)
        return
      }

      node.classList.add('landing-reveal-pending')
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          markVisible(node)
          observer.disconnect()
          observerRef.current = null
        },
        { threshold, rootMargin },
      )
      observer.observe(node)
      observerRef.current = observer
    },
    [cleanup, enabled, threshold, rootMargin],
  )
}
