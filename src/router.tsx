import { createBrowserRouter } from 'react-router'

import { SessionProvider } from '@/features/auth/SessionProvider'
import { RequireAuth } from '@/routes/RequireAuth'
import { PublicOnly } from '@/routes/PublicOnly'
import { AppLayout } from '@/routes/AppLayout'
import { Landing } from '@/routes/Landing'
import { Login } from '@/routes/Login'
import { Signup } from '@/routes/Signup'
import { ForgotPassword } from '@/routes/ForgotPassword'
import { ResetPassword } from '@/routes/ResetPassword'
import { Privacy } from '@/routes/Privacy'
import { Applications } from '@/routes/Applications'
import { Settings } from '@/routes/Settings'
import { NotFound } from '@/routes/NotFound'

export const router = createBrowserRouter([
  {
    element: <SessionProvider />,
    children: [
      { path: '/', element: <Landing /> },
      {
        element: <PublicOnly />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> },
        ],
      },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'privacy', element: <Privacy /> },
      {
        path: 'app',
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Applications /> },
              { path: 'settings', element: <Settings /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
