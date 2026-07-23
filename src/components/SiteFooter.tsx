type SiteFooterProps = {
  onHome?: () => void
  onFeatures?: () => void
  onPrivacyPolicy: () => void
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

export default function SiteFooter({
  onHome,
  onFeatures,
  onPrivacyPolicy,
}: SiteFooterProps) {
  return (
    <footer className="relative z-10 border-t border-[#3C096C] bg-[#240046] px-4 pt-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-lg font-bold tracking-tight text-[#E0AAFF]">JobSheets</span>
          <p className="text-sm text-[#C77DFF]">
            Track every application. Land the job.
          </p>
          <a
            href="https://github.com/roleyrogan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="mt-1 w-fit text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
          >
            <GitHubIcon className="size-5" />
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-[#7B2CBF]">Site</h2>
          <nav className="flex flex-col gap-2">
            {onHome ? (
              <button
                type="button"
                onClick={onHome}
                className="w-fit text-left text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
              >
                Home
              </button>
            ) : (
              <a
                href="#top"
                className="text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
              >
                Home
              </a>
            )}
            {onFeatures ? (
              <button
                type="button"
                onClick={onFeatures}
                className="w-fit text-left text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
              >
                Features
              </button>
            ) : (
              <a
                href="#features"
                className="text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
              >
                Features
              </a>
            )}
            <button
              type="button"
              onClick={onPrivacyPolicy}
              className="w-fit text-left text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
            >
              Privacy Policy
            </button>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-[#3C096C] py-6 text-center">
        <p className="text-sm text-[#7B2CBF]">
          © 2026 JobSheets. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
