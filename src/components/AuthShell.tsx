import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Footer } from '@/components/Footer'
import { PageTitle } from '@/components/PageTitle'

type AuthShellProps = {
  title: string
  children: ReactNode
}

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <header className="flex h-12 items-center border-b border-rule px-4">
        <Link to="/" className="text-sm font-medium">
          JobSheets
        </Link>
      </header>
      <main className="flex flex-1 flex-col px-4 py-10">
        <div className="flex w-full max-w-[360px] flex-col gap-6">
          <PageTitle>{title}</PageTitle>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
