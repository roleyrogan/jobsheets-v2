type SiteFooterProps = {
  onHome: () => void
  onFeatures: () => void
  onPrivacyPolicy: () => void
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
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-[#7B2CBF]">Site</h2>
          <nav className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onHome}
              className="w-fit text-left text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={onFeatures}
              className="w-fit text-left text-sm text-[#C77DFF] transition-colors hover:text-[#E0AAFF]"
            >
              Features
            </button>
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
