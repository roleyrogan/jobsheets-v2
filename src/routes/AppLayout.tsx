import { Link, Outlet, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { signOut } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'

export function AppLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not sign out',
      )
    }
  }

  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
          <Link to="/app" className="text-[15px] font-semibold">
            JobSheets
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/settings">Settings</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
