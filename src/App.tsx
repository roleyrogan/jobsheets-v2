import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import JobForm from './components/JobForm'
import { supabase } from './supabase'
import type { Application } from './types'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [appsError, setAppsError] = useState('')

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
          <button
            type="button"
            onClick={handleLogout}
            className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        <JobForm userId={session.user.id} onAdd={handleAdd} />

        <div className="border border-dashed border-[#3C096C] rounded-xl p-8 text-center">
          {appsLoading ? (
            <p className="text-[#C77DFF] text-sm">Loading applications...</p>
          ) : appsError ? (
            <p className="text-red-400 text-sm">{appsError}</p>
          ) : (
            <p className="text-[#C77DFF] text-sm">Your applications will appear here</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
