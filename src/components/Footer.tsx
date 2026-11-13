import { Link } from 'react-router'

const FEEDBACK_URL = 'https://forms.gle/Gx9i1sxnRSF7RUrq5'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-rule">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-6 text-sm text-ink-2">
        <Link to="/privacy" className="hover:underline hover:underline-offset-4">
          Privacy
        </Link>
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4"
        >
          Send feedback
        </a>
        <span className="ml-auto">© {year} JobSheets</span>
      </div>
    </footer>
  )
}
