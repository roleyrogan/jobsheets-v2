import { useEffect } from 'react'
import { MotionConfig, motion } from 'motion/react'
import { NavLink, Outlet, useLocation, useSearchParams } from 'react-router'

import { ApplicationDialogsProvider } from '@/features/applications/ApplicationDialogsProvider'
import { ApplicationsHeader } from '@/features/applications/ApplicationsHeader'
import { useApplicationEvents } from '@/features/applications/queries'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
import { layoutTransition } from '@/lib/motion'
import { isAppView, setLastView } from '@/lib/lastView'

const views = [
  { to: 'sheet', label: 'Sheet' },
  { to: 'board', label: 'Board' },
  { to: 'overview', label: 'Overview' },
] as const

function viewHref(
  view: (typeof views)[number]['to'],
  q: string | null,
): string {
  if (view === 'overview') return '/app/overview'
  if (q === null || q === '') return `/app/${view}`
  return `/app/${view}?q=${encodeURIComponent(q)}`
}

function WorkspaceChrome() {
  const { openCreate, openImport } = useApplicationDialogs()
  useApplicationEvents()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const q = searchParams.get('q')

  useEffect(() => {
    const segment = location.pathname.split('/').pop()
    if (segment !== undefined && isAppView(segment)) {
      setLastView(segment)
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col gap-6">
      <ApplicationsHeader onAdd={openCreate} onImport={openImport} />

      <nav aria-label="Views" className="flex gap-4 border-b border-b-rule">
        {views.map((view) => (
          <NavLink
            key={view.to}
            to={viewHref(view.to, q)}
            viewTransition
            className={({ isActive }) =>
              isActive
                ? 'relative -mb-px pb-2 text-sm text-ink'
                : 'relative -mb-px pb-2 text-sm text-ink-2 transition-colors duration-[120ms] ease-[var(--ease)] hover:text-ink'
            }
          >
            {({ isActive }) => (
              <>
                {view.label}
                {isActive ? (
                  <motion.span
                    layoutId="view-tab-underline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-ink"
                    transition={layoutTransition}
                  />
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="workspace-view">
        <Outlet />
      </div>
    </div>
  )
}

export function ApplicationsWorkspace() {
  return (
    <MotionConfig reducedMotion="user">
      <ApplicationDialogsProvider>
        <WorkspaceChrome />
      </ApplicationDialogsProvider>
    </MotionConfig>
  )
}
