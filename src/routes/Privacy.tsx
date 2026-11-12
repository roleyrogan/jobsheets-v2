import { Link } from 'react-router'

import { Footer } from '@/components/Footer'

const SUPABASE_PRIVACY = 'https://supabase.com/privacy'
const VERCEL_PRIVACY = 'https://vercel.com/legal/privacy-policy'
const FEEDBACK_URL = 'https://forms.gle/Gx9i1sxnRSF7RUrq5'

export function Privacy() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-[40rem] flex-1 px-4 py-10">
        <p className="mb-8">
          <Link
            to="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← Back
          </Link>
        </p>

        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: November 12, 2026
            </p>
          </header>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Overview</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              JobSheets is a job application tracking tool built for students
              and job seekers. This privacy policy explains what data we collect
              and how we use it.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Data we collect</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Email address for sign-in</li>
              <li>
                Application data you enter or import: company, role, status,
                link, location, notes, and date added
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">How we use your data</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Only to provide the JobSheets service</li>
              <li>Your email identifies your account</li>
              <li>Application data is stored so you can access it across devices</li>
              <li>We do not sell your data</li>
              <li>We do not use your data for advertising</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Storage and security</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Data is stored in Supabase (Postgres) with row-level security, so
              each account can only read its own applications. The app is hosted
              on Vercel.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Your control</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can edit or delete any application at any time, and export
              everything as CSV. To permanently delete your account and all its
              applications, go to{' '}
              <Link
                to="/app/settings"
                className="underline underline-offset-4"
              >
                Settings
              </Link>
              . That action cannot be undone.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Third-party services</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              JobSheets relies on these third-party services:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                <a
                  href={SUPABASE_PRIVACY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Supabase
                </a>
              </li>
              <li>
                <a
                  href={VERCEL_PRIVACY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Vercel
                </a>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Questions about this policy? Send feedback via{' '}
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                this form
              </a>
              .
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">Changes</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This policy may be updated from time to time. Changes will be
              reflected with an updated date at the top of this page.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
