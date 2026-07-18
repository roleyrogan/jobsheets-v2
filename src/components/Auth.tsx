import { useState } from 'react'
import { supabase } from '../supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSignUp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setError('Check your email to confirm your account')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#10002B] flex items-center justify-center">
      <div className="bg-[#240046] border border-[#3C096C] rounded-xl p-8 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-[#E0AAFF] text-3xl font-bold text-center">JobSheets</h1>
        <p className="text-[#C77DFF] text-center text-sm">Track your co-op and internship applications</p>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-[#10002B] border border-[#3C096C] rounded-lg px-4 py-2 text-[#E0AAFF] placeholder-[#7B2CBF] outline-none focus:border-[#7B2CBF]"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#7B2CBF] hover:bg-[#9D4EDD] text-[#E0AAFF] rounded-lg py-2 font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Log In'}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="border border-[#7B2CBF] text-[#C77DFF] hover:bg-[#3C096C] rounded-lg py-2 font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}