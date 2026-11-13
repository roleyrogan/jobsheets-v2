import { Link } from 'react-router'

import { Footer } from '@/components/Footer'
import { PageTitle } from '@/components/PageTitle'

const SUPABASE_PRIVACY = 'https://supabase.com/privacy'
const VERCEL_PRIVACY = 'https://vercel.com/legal/privacy-policy'
const FEEDBACK_URL = 'https://forms.gle/Gx9i1sxnRSF7RUrq5'

const body = 'text-sm leading-[22px] text-ink'
const list = 'list-disc space-y-2 pl-5 text-sm leading-[22px] text-ink'
const linkClass = 'underline underline-offset-4'

export function Privacy() {
  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <header className="flex h-12 items-center border-b border-rule px-4">
        <Link to="/" className="text-sm font-medium">
          JobSheets
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-10">
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <PageTitle>Privacy Policy</PageTitle>
            <p className="text-sm text-ink-2">Last updated: November 12, 2026</p>
          </header>

          <section className="flex flex-col gap-3">
            <h2>Overview</h2>
            <p className={body}>
              JobSheets is a job application tracking tool built for students
              and job seekers. This privacy policy explains what data we collect
              and how we use it.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Data we collect</h2>
            <ul className={list}>
              <li>Email address for sign-in</li>
              <li>
                Application data you enter or import: company, role, status,
                link, location, notes, and date added
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2>How we use your data</h2>
            <ul className={list}>
              <li>Only to provide the JobSheets service</li>
              <li>Your email identifies your account</li>
              <li>
                Application data is stored so you can access it across devices
              </li>
              <li>We do not sell your data</li>
              <li>We do not use your data for advertising</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Storage and security</h2>
            <p className={body}>
              Data is stored in Supabase (Postgres) with row-level security, so
              each account can only read its own applications. The app is hosted
              on Vercel.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Your control</h2>
            <p className={body}>
              You can edit or delete any application at any time, and export
              everything as CSV. To permanently delete your account and all its
              applications, go to{' '}
              <Link to="/app/settings" className={linkClass}>
                Settings
              </Link>
              . That action cannot be undone.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Third-party services</h2>
            <p className={body}>
              JobSheets relies on these third-party services:
            </p>
            <ul className={list}>
              <li>
                <a
                  href={SUPABASE_PRIVACY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Supabase
                </a>
              </li>
              <li>
                <a
                  href={VERCEL_PRIVACY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Vercel
                </a>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Contact</h2>
            <p className={body}>
              Questions about this policy? Send feedback via{' '}
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                this form
              </a>
              .
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>Changes</h2>
            <p className={body}>
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
