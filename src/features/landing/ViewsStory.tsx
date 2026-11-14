import { useEffect, useMemo, useRef, useState, type RefCallback } from 'react'

import { StoryIllustrations } from '@/features/landing/StoryIllustrations'
import {
  STORY_STEPS,
  type StoryStepId,
} from '@/features/landing/sampleData'
import { useReveal } from '@/features/landing/useReveal'

function pickActiveStep(): StoryStepId | null {
  const mid = window.innerHeight / 2
  const bandTop = window.innerHeight * 0.45
  const bandBottom = window.innerHeight * 0.55
  let bestId: StoryStepId | null = null
  let bestDist = Number.POSITIVE_INFINITY

  for (const step of STORY_STEPS) {
    const el = document.querySelector(`#views [data-step="${step.id}"]`)
    if (!(el instanceof HTMLElement)) continue
    const rect = el.getBoundingClientRect()
    if (rect.bottom <= bandTop || rect.top >= bandBottom) continue
    const dist = Math.abs((rect.top + rect.bottom) / 2 - mid)
    if (dist < bestDist) {
      bestDist = dist
      bestId = step.id
    }
  }

  return bestId
}

export function ViewsStory() {
  const headingRef = useReveal<HTMLDivElement>()
  const stepsRevealRef = useReveal<HTMLDivElement>()
  const [active, setActive] = useState<StoryStepId>('sheet')

  const observerRef = useRef<IntersectionObserver | null>(null)
  const nodesRef = useRef<Partial<Record<StoryStepId, HTMLElement>>>({})

  const binders = useMemo(() => {
    function syncActive() {
      const next = pickActiveStep()
      if (!next) return
      setActive((current) => (current === next ? current : next))
    }

    function ensureObserver() {
      if (observerRef.current || typeof IntersectionObserver === 'undefined') {
        return observerRef.current
      }
      observerRef.current = new IntersectionObserver(syncActive, {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
      return observerRef.current
    }

    const next = {} as Record<StoryStepId, RefCallback<HTMLElement>>
    for (const step of STORY_STEPS) {
      next[step.id] = (node) => {
        const previous = nodesRef.current[step.id]
        if (previous && previous !== node) {
          observerRef.current?.unobserve(previous)
          delete nodesRef.current[step.id]
        }
        if (!node) return

        nodesRef.current[step.id] = node

        if (typeof IntersectionObserver === 'undefined') {
          setActive(step.id)
          return
        }

        ensureObserver()?.observe(node)
        syncActive()
      }
    }
    return next
  }, [])

  useEffect(() => {
    function syncActive() {
      const next = pickActiveStep()
      if (!next) return
      setActive((current) => (current === next ? current : next))
    }

    if (typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(syncActive, {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
      for (const node of Object.values(nodesRef.current)) {
        if (node) observerRef.current.observe(node)
      }
    }

    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('scrollend', syncActive)
    window.addEventListener('resize', syncActive)
    syncActive()

    return () => {
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('scrollend', syncActive)
      window.removeEventListener('resize', syncActive)
      observerRef.current?.disconnect()
      observerRef.current = null
      // Leave nodesRef alone — binders own attach/detach. Clearing here
      // breaks Strict Mode (effect cleanup runs without re-firing refs).
    }
  }, [])

  return (
    <section id="views" className="flex flex-col gap-8">
      <div ref={headingRef} className="flex flex-col gap-3">
        <h2 className="text-[22px] leading-7 font-semibold min-[760px]:text-[28px] min-[760px]:leading-8">
          Three views of the same sheet.
        </h2>
        <div className="landing-rule-draw h-px w-full bg-ink" />
      </div>

      <div className="flex flex-col gap-8 min-[760px]:grid min-[760px]:grid-cols-[1fr_1.25fr] min-[760px]:items-start min-[760px]:gap-16">
        {/*
          Mobile: `contents` so sticky's ancestor is this flex column (tall enough
          to cover the steps). Desktop: a stretching grid column for sticky travel.
        */}
        <div className="contents min-[760px]:order-last min-[760px]:block min-[760px]:self-stretch">
          <div className="sticky top-2 order-first z-10 h-[240px] w-full border border-ink bg-paper min-[760px]:top-28 min-[760px]:order-none min-[760px]:h-[380px]">
            <StoryIllustrations active={active} />
          </div>
        </div>

        <div ref={stepsRevealRef} className="flex flex-col">
          {STORY_STEPS.map((step, index) => (
            <article
              key={step.id}
              ref={binders[step.id]}
              data-step={step.id}
              className={`landing-reveal-child flex min-h-[46vh] flex-col justify-center gap-2 py-8 min-[760px]:min-h-[62vh] ${
                index < STORY_STEPS.length - 1 ? 'border-b border-b-rule' : ''
              } ${
                active === step.id
                  ? 'text-ink transition-colors duration-300 ease-[var(--ease)]'
                  : 'text-ink-2 transition-colors duration-300 ease-[var(--ease)]'
              }`}
            >
              <h3 className="text-[22px] leading-7 font-semibold">
                {step.title}
              </h3>
              <p className="max-w-[40ch] text-[15px] leading-6">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
