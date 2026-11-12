import { Link } from 'react-router'

import { useSession } from '@/features/auth/useSession'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'

const FEATURES = [
  {
    title: 'Track applications',
    body: 'Company, role, status, link, location, and notes.',
  },
  {
    title: 'Update status in one click',
    body: 'Change status as you hear back.',
  },
  {
    title: 'Search, filter and sort',
    body: 'Narrow your list; filtered views have shareable URLs.',
  },
  {
    title: 'Import and export CSV',
    body: 'Import from a spreadsheet and export any time.',
  },
  {
    title: 'Private to your account',
    body: 'Your data is private to your account.',
  },
] as const

export function Landing() {
  const { status } = useSession()
  const signedIn = status === 'signedIn'

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="font-medium tracking-tight">
            JobSheets
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            {signedIn ? (
              <Button asChild size="sm">
                <Link to="/app">Open app</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-4 py-16">
        <section className="flex max-w-xl flex-col gap-5">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Keep track of every job application.
          </h1>
          <p className="text-muted-foreground">
            JobSheets is a simple tracker for students and job seekers. Log each
            application, update its status as you hear back, and see where your
            search stands.
          </p>
          <div>
            <Button asChild>
              <Link to={signedIn ? '/app' : '/signup'}>Get started</Link>
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="what-it-does">
          <h2 id="what-it-does" className="text-xl font-medium tracking-tight">
            What it does
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex flex-col gap-1">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
