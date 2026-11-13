import { Link } from 'react-router'

import { useReveal } from '@/features/landing/useReveal'

const FEEDBACK_URL = 'https://forms.gle/Gx9i1sxnRSF7RUrq5'

type FooterProps = {
  reveal?: boolean
}

export function Footer({ reveal = false }: FooterProps) {
  const year = new Date().getFullYear()
  const ref = useReveal<HTMLElement>({ enabled: reveal })

  return (
    <footer ref={reveal ? ref : undefined} className="border-t border-t-rule">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-6 text-sm text-ink-2">
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
