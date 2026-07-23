import SiteFooter from './SiteFooter'

type PrivacyPolicyProps = {
  onBack: () => void
  onHome: () => void
  onFeatures: () => void
  onPrivacyPolicy: () => void
}

export default function PrivacyPolicy({
  onBack,
  onHome,
  onFeatures,
  onPrivacyPolicy,
}: PrivacyPolicyProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#10002B] text-[#E0AAFF]">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={onBack}
          className="mb-10 text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
        >
          ← Back to JobSheets
        </button>

        <article>
          <h1 className="mb-2 text-3xl font-bold text-[#E0AAFF]">Privacy Policy</h1>
          <p className="mb-10 text-sm text-[#C77DFF]">Last updated: July 2026</p>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Overview</h2>
            <p className="text-sm leading-relaxed text-[#E0AAFF]">
              JobSheets is a job application tracking tool built for students and job seekers.
              This privacy policy explains what data we collect and how we use it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Data We Collect</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#E0AAFF]">
              <li>Email address for authentication</li>
              <li>
                Job application data including company names, roles, statuses, notes, and URLs
              </li>
              <li>Date and time entries are created</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">How We Use Your Data</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#E0AAFF]">
              <li>Data is used solely to provide the JobSheets service</li>
              <li>Your email identifies your account</li>
              <li>Application data is stored for cross-device access</li>
              <li>We do not sell data to third parties</li>
              <li>We do not use data for advertising</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Data Storage</h2>
            <p className="text-sm leading-relaxed text-[#E0AAFF]">
              Data is stored securely using Supabase with row-level security so applications
              are only accessible to the logged-in user.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Data Deletion</h2>
            <p className="text-sm leading-relaxed text-[#E0AAFF]">
              Individual applications can be deleted in the app. For full account deletion,
              contact via{' '}
              <a
                href="https://github.com/roleyrogan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9D4EDD] underline underline-offset-2 hover:text-[#E0AAFF]"
              >
                GitHub
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Third Party Services</h2>
            <p className="mb-3 text-sm leading-relaxed text-[#E0AAFF]">
              JobSheets relies on the following third-party services:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#E0AAFF]">
              <li>
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9D4EDD] underline underline-offset-2 hover:text-[#E0AAFF]"
                >
                  Supabase
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9D4EDD] underline underline-offset-2 hover:text-[#E0AAFF]"
                >
                  Vercel
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Contact</h2>
            <p className="text-sm leading-relaxed text-[#E0AAFF]">
              Questions about this policy? Reach out at{' '}
              <a
                href="https://github.com/roleyrogan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9D4EDD] underline underline-offset-2 hover:text-[#E0AAFF]"
              >
                https://github.com/roleyrogan
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-[#C77DFF]">Changes</h2>
            <p className="text-sm leading-relaxed text-[#E0AAFF]">
              This policy may be updated from time to time. Changes will be reflected with an
              updated date at the top of this page.
            </p>
          </section>
        </article>
      </div>

      <SiteFooter
        onHome={onHome}
        onFeatures={onFeatures}
        onPrivacyPolicy={onPrivacyPolicy}
      />
    </div>
  )
}
