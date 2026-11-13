import { createBrowserRouter } from 'react-router'

import { SessionProvider } from '@/features/auth/SessionProvider'
import { PublicOnly } from '@/routes/PublicOnly'
import { Landing } from '@/routes/Landing'
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
          {
            path: 'login',
            lazy: async () => {
              const { Login } = await import('@/routes/Login')
              return { Component: Login }
            },
          },
          {
            path: 'signup',
            lazy: async () => {
              const { Signup } = await import('@/routes/Signup')
              return { Component: Signup }
            },
          },
        ],
      },
      {
        path: 'forgot-password',
        lazy: async () => {
          const { ForgotPassword } = await import('@/routes/ForgotPassword')
          return { Component: ForgotPassword }
        },
      },
      {
        path: 'reset-password',
        lazy: async () => {
          const { ResetPassword } = await import('@/routes/ResetPassword')
          return { Component: ResetPassword }
        },
      },
      {
        path: 'privacy',
        lazy: async () => {
          const { Privacy } = await import('@/routes/Privacy')
          return { Component: Privacy }
        },
      },
      {
        path: 'app',
        lazy: async () => {
          const { RequireAuth } = await import('@/routes/RequireAuth')
          return { Component: RequireAuth }
        },
        children: [
          {
            lazy: async () => {
              const { AppLayout } = await import('@/routes/AppLayout')
              return { Component: AppLayout }
            },
            children: [
              {
                index: true,
                lazy: async () => {
                  const { AppRedirect } = await import('@/routes/AppRedirect')
                  return { Component: AppRedirect }
                },
              },
              {
                lazy: async () => {
                  const { ApplicationsWorkspace } =
                    await import('@/routes/ApplicationsWorkspace')
                  return { Component: ApplicationsWorkspace }
                },
                children: [
                  {
                    path: 'sheet',
                    lazy: async () => {
                      const { SheetView } = await import('@/routes/SheetView')
                      return { Component: SheetView }
                    },
                  },
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
              {
                path: 'settings',
                lazy: async () => {
                  const { Settings } = await import('@/routes/Settings')
                  return { Component: Settings }
                },
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
