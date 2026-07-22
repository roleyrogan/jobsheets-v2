import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../supabase'
import Grainient from './Grainient'

type Mode = 'login' | 'register'

const inputClassName =
  'bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 pr-11 text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF] w-full'

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)

    setLoading(false)
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Account created! You can now sign in.')
    setMode('login')
    setPassword('')
    setConfirmPassword('')
    setLoading(false)
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#10002B] flex items-center justify-center px-4">
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

      <div className="relative z-10 w-full max-w-sm">
        <p className="text-[#E0AAFF] text-sm font-bold text-center mb-4 tracking-tight">
          JobSheets
        </p>

        <div className="bg-[#240046] border border-[#3C096C] rounded-xl p-8 flex flex-col gap-4">
          {mode === 'login' ? (
            <>
              <div className="text-center">
                <h1 className="text-[#E0AAFF] text-2xl font-bold">Welcome back</h1>
                <p className="text-[#C77DFF] text-sm mt-1">Sign in to your account</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C77DFF] hover:text-[#E0AAFF] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Sign In'}
                </button>
              </form>

              {success && (
                <p className="text-green-400 text-sm text-center">{success}</p>
              )}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <p className="text-[#C77DFF] text-sm text-center">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-[#C77DFF] font-medium underline underline-offset-2 hover:text-[#E0AAFF] transition-colors"
                >
                  Register now
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-[#E0AAFF] text-2xl font-bold">Create your account</h1>
                <p className="text-[#C77DFF] text-sm mt-1">
                  Start tracking your job search for free
                </p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C77DFF] hover:text-[#E0AAFF] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C77DFF] hover:text-[#E0AAFF] transition-colors"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Create Account'}
                </button>
              </form>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <p className="text-[#C77DFF] text-sm text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#C77DFF] font-medium underline underline-offset-2 hover:text-[#E0AAFF] transition-colors"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
