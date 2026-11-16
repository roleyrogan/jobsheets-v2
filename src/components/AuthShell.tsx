import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { AuthSampleSheet } from '@/components/AuthSampleSheet'
import { Footer } from '@/components/Footer'
import { PageTitle } from '@/components/PageTitle'

type AuthShellProps = {
  title: string
  children: ReactNode
}

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-paper text-ink">
      <header className="border-b border-b-rule">
        <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center px-5 md:px-4">
          <Link to="/" className="text-sm font-medium">
            JobSheets
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-5 md:px-4">
        <div className="grid flex-1 content-center items-center py-10 md:grid-cols-[400px_minmax(0,1fr)] md:gap-24">
          <div className="flex w-full max-w-[400px] flex-col gap-6">
            <PageTitle>{title}</PageTitle>
            {children}
          </div>
          <div className="hidden min-w-0 md:block">
            <AuthSampleSheet />
          </div>
        </div>
      </main>

      <Footer contentClassName="px-5 md:px-4" />
    </div>
  )
}
