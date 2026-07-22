import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Button } from '@heroui/react'
import Auth from './components/Auth'
import Grainient from './components/Grainient'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import LandingPage from './components/LandingPage'
import Summary from './components/Summary'
import { filledButtonClass, ghostButtonClass, outlineButtonClass } from './lib/heroui-button'
import { supabase } from './supabase'
import type { Application } from './types'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [appsError, setAppsError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setApplications([])
      return
    }

    const userId = session.user.id

    async function fetchApplications() {
      setAppsLoading(true)
      setAppsError('')

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        setAppsError(error.message)
      } else {
        setApplications((data as Application[]) ?? [])
      }

      setAppsLoading(false)
    }

    fetchApplications()
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    setShowAuth(false)
  }

  function handleAdd(application: Application) {
    setApplications(prev => [application, ...prev])
    setShowForm(false)
  }

  function handleDelete(id: string) {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  function handleStatusUpdate(id: string, newStatus: string) {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: newStatus as Application['status'] }
          : app
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002B] flex items-center justify-center">
        <p className="text-[#C77DFF] text-sm">Loading...</p>
      </div>
    )
  }

  if (!session) {
    if (showAuth) {
      return (
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            onPress={() => setShowAuth(false)}
            className={`absolute top-0 left-0 z-10 p-4 ${ghostButtonClass}`}
          >
            ← Back
          </Button>
          <Auth />
        </div>
      )
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#10002B] text-[#E0AAFF]">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <Grainient
          color1="#10002B"
          color2="#7B2CBF"
          color3="#E0AAFF"
          timeSpeed={0.25}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#10002B]/35" />

      <header className="relative z-10 border-b border-[#3C096C] bg-[#240046]/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-[#E0AAFF] text-2xl font-bold">JobSheets</h1>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onPress={() => setShowForm(open => !open)}
              className={filledButtonClass}
            >
              {showForm ? 'Cancel' : 'Add Application'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onPress={handleLogout}
              className={outlineButtonClass}
            >
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 min-h-screen">
        {showForm && (
          <JobForm
            userId={session.user.id}
            onAdd={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}

        {appsLoading ? (
          <p className="text-[#C77DFF] text-sm text-center">Loading applications...</p>
        ) : appsError ? (
          <p className="text-red-400 text-sm text-center">{appsError}</p>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center py-12">
            <p className="text-[#C77DFF] text-lg font-medium">No applications yet</p>
            <p className="text-[#C77DFF] text-sm opacity-70">
              Start tracking your job search by adding your first application
            </p>
            <Button
              type="button"
              onPress={() => setShowForm(true)}
              className={`${filledButtonClass} mt-2`}
            >
              Add Application
            </Button>
          </div>
        ) : (
          <>
            <Summary applications={applications} />
            <JobList
              applications={applications}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
