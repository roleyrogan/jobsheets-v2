import { useEffect, useRef, useState } from 'react'

import { StoryIllustrations } from '@/features/landing/StoryIllustrations'
import {
  STORY_STEPS,
  type StoryStepId,
} from '@/features/landing/sampleData'
import { useReveal } from '@/features/landing/useReveal'

function isStoryStepId(value: string | undefined): value is StoryStepId {
  return STORY_STEPS.some((step) => step.id === value)
}

export function ViewsStory() {
  const headingRef = useReveal<HTMLDivElement>()
  const stepsRef = useReveal<HTMLDivElement>()
  const panelRef = useReveal<HTMLDivElement>()
  const [active, setActive] = useState<StoryStepId>('sheet')
  const stepRefs = useRef<Record<StoryStepId, HTMLElement | null>>({
    sheet: null,
    board: null,
    overview: null,
  })

  useEffect(() => {
    const nodes = STORY_STEPS.map((step) => stepRefs.current[step.id]).filter(
      (node): node is HTMLElement => node !== null,
    )
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (!top || !(top.target instanceof HTMLElement)) return
        const id = top.target.dataset.step
        if (isStoryStepId(id)) setActive(id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="views" className="flex flex-col gap-8">
      <div ref={headingRef} className="flex flex-col gap-3">
        <h2 className="text-[22px] leading-7 font-semibold min-[760px]:text-[28px] min-[760px]:leading-8">
          Three views of the same sheet.
        </h2>
        <div className="landing-rule-draw h-px w-full bg-ink" />
      </div>

      <div className="flex flex-col gap-8 min-[760px]:grid min-[760px]:grid-cols-[1fr_1.25fr] min-[760px]:gap-16">
        <div ref={panelRef} className="order-first min-[760px]:order-last">
          <div className="sticky top-2 h-[240px] border border-ink bg-paper min-[760px]:top-28 min-[760px]:h-[380px]">
            <StoryIllustrations active={active} />
          </div>
        </div>

        <div ref={stepsRef} className="flex flex-col">
          {STORY_STEPS.map((step, index) => (
            <article
              key={step.id}
              ref={(node) => {
                stepRefs.current[step.id] = node
              }}
              data-step={step.id}
              className={`landing-reveal-child flex min-h-[46vh] flex-col justify-center gap-2 py-8 min-[760px]:min-h-[62vh] ${
                index < STORY_STEPS.length - 1 ? 'border-b border-b-rule' : ''
              } ${
                active === step.id
                  ? 'text-ink transition-colors duration-300 ease-[var(--ease)]'
                  : 'text-ink-2 transition-colors duration-300 ease-[var(--ease)]'
              }`}
            >
              <h3 className="text-[22px] leading-7 font-semibold">{step.title}</h3>
              <p className="max-w-[40ch] text-[15px] leading-6">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
