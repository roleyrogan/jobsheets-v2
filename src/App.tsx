import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import Summary from './components/Summary'
import { supabase } from './supabase'
import type { Application } from './types'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
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
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-[#10002B]">
      <header className="border-b border-[#3C096C] bg-[#240046]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-[#E0AAFF] text-2xl font-bold">JobSheets</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowForm(open => !open)}
              className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              {showForm ? 'Cancel' : 'Add Application'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
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
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg px-4 py-2 text-sm font-medium transition-colors mt-2"
            >
              Add Application
            </button>
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
