import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  authRedirectHadError,
  clearAuthHash,
} from '@/lib/api/auth'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/router'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)

queueMicrotask(() => {
  if (!authRedirectHadError) return
  toast.error('That link has expired or was already used.')
  clearAuthHash()
})
