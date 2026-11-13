import { useEffect, useRef, type RefObject } from 'react'

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

/** Applies reveal classes on the node via the DOM after the observer is ready. */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const { threshold = 0.15, rootMargin, enabled = true } = options
  const nodeRef = useRef<T | null>(null)

  useEffect(() => {
    if (!enabled) return
    const el = nodeRef.current
    if (!el) return

    if (prefersStaticReveal()) {
      el.classList.add('landing-reveal-visible')
      return
    }

    el.classList.add('landing-reveal-pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.remove('landing-reveal-pending')
        el.classList.add('landing-reveal-visible')
        observer.disconnect()
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      el.classList.remove('landing-reveal-pending', 'landing-reveal-visible')
    }
  }, [threshold, rootMargin, enabled])

  return nodeRef
}
