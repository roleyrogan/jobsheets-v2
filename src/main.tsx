import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { toast } from 'sonner'

import {
  authRedirectHadError,
  clearAuthHash,
} from '@/lib/api/authFlags'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)

queueMicrotask(() => {
  if (!authRedirectHadError) return
  toast.error('That link has expired or was already used.')
  clearAuthHash()
})
