import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useSearchParams } from 'react-router'

import { ApplicationDialogsProvider } from '@/features/applications/ApplicationDialogsProvider'
import { ApplicationsHeader } from '@/features/applications/ApplicationsHeader'
import { useApplicationEvents } from '@/features/applications/queries'
import { useApplicationDialogs } from '@/features/applications/useApplicationDialogs'
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

      <nav aria-label="Views" className="flex gap-4 border-b">
        {views.map((view) => (
          <NavLink
            key={view.to}
            to={viewHref(view.to, q)}
            className={({ isActive }) =>
              isActive
                ? '-mb-px border-b-2 border-foreground pb-2 text-sm text-foreground'
                : '-mb-px border-b-2 border-transparent pb-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
            }
          >
            {view.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}

export function ApplicationsWorkspace() {
  return (
    <ApplicationDialogsProvider>
      <WorkspaceChrome />
    </ApplicationDialogsProvider>
  )
}
