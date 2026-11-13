import { createBrowserRouter } from 'react-router'

import { SessionProvider } from '@/features/auth/SessionProvider'
import { RequireAuth } from '@/routes/RequireAuth'
import { PublicOnly } from '@/routes/PublicOnly'
import { AppLayout } from '@/routes/AppLayout'
import { AppRedirect } from '@/routes/AppRedirect'
import { ApplicationsWorkspace } from '@/routes/ApplicationsWorkspace'
import { SheetView } from '@/routes/SheetView'
import { Landing } from '@/routes/Landing'
import { Login } from '@/routes/Login'
import { Signup } from '@/routes/Signup'
import { ForgotPassword } from '@/routes/ForgotPassword'
import { ResetPassword } from '@/routes/ResetPassword'
import { Privacy } from '@/routes/Privacy'
import { Settings } from '@/routes/Settings'
import { NotFound } from '@/routes/NotFound'
import { RouteError } from '@/routes/RouteError'

export const router = createBrowserRouter([
  {
    element: <SessionProvider />,
    errorElement: <RouteError />,
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
              { index: true, element: <AppRedirect /> },
              {
                element: <ApplicationsWorkspace />,
                children: [
                  { path: 'sheet', element: <SheetView /> },
                  {
                    path: 'board',
                    lazy: async () => {
                      const { BoardView } = await import('@/routes/BoardView')
                      return { Component: BoardView }
                    },
                  },
                  {
                    path: 'overview',
                    lazy: async () => {
                      const { OverviewView } =
                        await import('@/routes/OverviewView')
                      return { Component: OverviewView }
                    },
                  },
                ],
              },
              { path: 'settings', element: <Settings /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
