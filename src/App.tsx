import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Button, CloseButton, Modal, useOverlayState } from '@heroui/react'
import Auth from './components/Auth'
import AccountMenu from './components/AccountMenu'
import EditForm from './components/EditForm'
import Grainient from './components/Grainient'
import JobForm from './components/JobForm'
import JobList from './components/JobList'
import LandingPage from './components/LandingPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import SiteFooter from './components/SiteFooter'
import Summary from './components/Summary'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'
import { filledButtonClass, ghostButtonClass } from './lib/heroui-button'
import { supabase } from './supabase'
import type { Application } from './types'
import { exportToCSV } from './utils/exportCSV'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showLanding, setShowLanding] = useState(false)
  const [scrollToFeatures, setScrollToFeatures] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [appsError, setAppsError] = useState('')
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const formModal = useOverlayState()
  const editModal = useOverlayState()
  const { toast, showToast, hideToast } = useToast()

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
        showToast('Something went wrong', 'error')
      } else {
        setApplications((data as Application[]) ?? [])
      }

      setAppsLoading(false)
    }

    fetchApplications()
  }, [session, showToast])

  useEffect(() => {
    if (session && showAuth) {
      setShowAuth(false)
      setShowLanding(false)
    }
  }, [session, showAuth])

  useEffect(() => {
    if (!scrollToFeatures || showAuth || showPrivacy) return
    if (session && !showLanding) return

    const frame = requestAnimationFrame(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      setScrollToFeatures(false)
    })

    return () => cancelAnimationFrame(frame)
  }, [scrollToFeatures, showAuth, showPrivacy, session, showLanding])

  async function handleLogout() {
    await supabase.auth.signOut()
    setShowAuth(false)
    setShowLanding(false)
  }

  function handleAccountDeleted() {
    setApplications([])
    setShowAuth(false)
    setShowLanding(false)
  }

  function handleAdd(application: Application) {
    setApplications(prev => [application, ...prev])
    formModal.close()
    showToast('Application added successfully', 'success')
  }

  function handleDelete(id: string) {
    setApplications(prev => prev.filter(app => app.id !== id))
    showToast('Application deleted', 'error')
  }

  function handleEdit(application: Application) {
    setEditingApplication(application)
    editModal.open()
  }

  function handleSave(application: Application) {
    setApplications(prev =>
      prev.map(app => (app.id === application.id ? application : app))
    )
    showToast('Application updated', 'success')
  }

  function handleCloseEdit() {
    setEditingApplication(null)
    editModal.close()
  }

  function handleStatusUpdate(id: string, newStatus: string) {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: newStatus as Application['status'] }
          : app
      )
    )
    showToast('Status updated', 'success')
  }

  function scrollToTop() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  function goHome() {
    setShowPrivacy(false)
    setShowAuth(false)
    setShowLanding(true)
    setScrollToFeatures(false)
    scrollToTop()
  }

  function goBackFromPrivacy() {
    setShowPrivacy(false)
    setShowAuth(false)
    setShowLanding(false)
    setScrollToFeatures(false)
    scrollToTop()
  }

  function goFeatures() {
    setShowPrivacy(false)
    setShowAuth(false)
    setShowLanding(true)
    setScrollToFeatures(true)
  }

  function goPrivacy() {
    setShowAuth(false)
    setShowLanding(false)
    setShowPrivacy(true)
    scrollToTop()
  }

  function handleGetStarted() {
    if (session) {
      setShowLanding(false)
      return
    }
    setShowAuth(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002B] flex items-center justify-center">
        <p className="text-[#C77DFF] text-sm">Loading...</p>
      </div>
    )
  }

  if (showPrivacy) {
    return (
      <PrivacyPolicy
        onBack={goBackFromPrivacy}
        onHome={goHome}
        onFeatures={goFeatures}
        onPrivacyPolicy={goPrivacy}
      />
    )
  }

  if (!session || showLanding) {
    if (showAuth && !session) {
      return (
        <div className="relative flex min-h-screen flex-col bg-[#10002B]">
          <div className="relative flex-1">
            <Button
              type="button"
              variant="ghost"
              onPress={goHome}
              className={`absolute top-0 left-0 z-10 p-4 ${ghostButtonClass}`}
            >
              ← Back
            </Button>
            <Auth />
          </div>
          <SiteFooter
            onHome={goHome}
            onFeatures={goFeatures}
            onPrivacyPolicy={goPrivacy}
          />
        </div>
      )
    }
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onHome={goHome}
        onFeatures={goFeatures}
        onPrivacyPolicy={goPrivacy}
      />
    )
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#10002B] text-[#E0AAFF]">
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

      <header className="fixed top-0 inset-x-0 z-50 pt-4 sm:pt-6">
        <div className="relative w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6">
            <div className="flex h-14 w-full max-w-2xl items-center justify-between gap-2 rounded-full border border-[#3C096C] bg-[#240046] px-3 shadow-lg backdrop-blur-md sm:h-16 sm:px-4">
              <h1 className="text-lg font-bold tracking-tight text-[#E0AAFF]">JobSheets</h1>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onPress={formModal.toggle}
                  className={`rounded-full ${filledButtonClass}`}
                >
                  Add Application
                </Button>
                <AccountMenu
                  session={session}
                  showToast={showToast}
                  onLogout={handleLogout}
                  onAccountDeleted={handleAccountDeleted}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-1 flex-col gap-8 px-4 pb-8 pt-28 sm:pt-32">
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
              onPress={formModal.open}
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
              exportToCSV={exportToCSV}
              showToast={showToast}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onStatusUpdate={handleStatusUpdate}
            />
          </>
        )}
      </main>

      <SiteFooter
        onHome={goHome}
        onFeatures={goFeatures}
        onPrivacyPolicy={goPrivacy}
      />

      <Modal state={formModal}>
        <Modal.Backdrop
          isDismissable
          variant="blur"
          className="bg-black/60 backdrop-blur-sm"
        >
          <Modal.Container size="md" scroll="outside" placement="center">
            <Modal.Dialog className="relative bg-transparent p-0 shadow-none outline-none">
              <CloseButton
                slot="close"
                aria-label="Close"
                className="absolute top-3 right-3 z-10 bg-transparent text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF] data-[hovered=true]:bg-[#3C096C] data-[hovered=true]:text-[#E0AAFF]"
              />
              <Modal.Body className="p-0">
                <JobForm
                  userId={session.user.id}
                  onAdd={handleAdd}
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal
        state={editModal}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setEditingApplication(null)
          }
        }}
      >
        <Modal.Backdrop
          isDismissable
          variant="blur"
          className="bg-black/60 backdrop-blur-sm"
        >
          <Modal.Container size="md" scroll="outside" placement="center">
            <Modal.Dialog className="relative bg-transparent p-0 shadow-none outline-none">
              <CloseButton
                slot="close"
                aria-label="Close"
                className="absolute top-3 right-3 z-10 bg-transparent text-[#C77DFF] hover:bg-[#3C096C] hover:text-[#E0AAFF] data-[hovered=true]:bg-[#3C096C] data-[hovered=true]:text-[#E0AAFF]"
              />
              <Modal.Body className="p-0">
                {editingApplication && (
                  <EditForm
                    application={editingApplication}
                    onSave={handleSave}
                    onClose={handleCloseEdit}
                  />
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  )
}

export default App
