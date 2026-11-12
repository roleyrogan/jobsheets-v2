import { Link } from 'react-router'

const FEEDBACK_URL = 'https://forms.gle/Gx9i1sxnRSF7RUrq5'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
        <Link to="/privacy" className="underline-offset-4 hover:underline">
          Privacy
        </Link>
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Send feedback
        </a>
        <span className="ml-auto">© {year} JobSheets</span>
      </div>
    </footer>
  )
}
