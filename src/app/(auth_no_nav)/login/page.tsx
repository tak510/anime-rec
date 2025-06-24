'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showResend, setShowResend] = useState(false)
  const [emailToResend, setEmailToResend] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    setShowResend(false)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setEmailToResend(email)
        setShowResend(true)
        setErrorMsg('Please confirm your email before logging in.')
      } else {
        setErrorMsg(error.message)
      }
      return
    }

    const session = data?.session
    if (!session?.user?.email_confirmed_at) {
      await supabase.auth.signOut()
      setEmailToResend(email)
      setShowResend(true)
      setErrorMsg('Please confirm your email before logging in.')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#1D1D1F] flex flex-col justify-center items-center text-[#F5EDF7]">
      <Link href="/" className="mb-6">
        <Image src="/av_logo.png" alt="Anivex Logo" width={100} height={100} />
      </Link>

      <h1 className="text-2xl font-bold mb-2 font-orbitron">Welcome Back</h1>
      <p className="mb-6 text-sm text-[#FF5DA2]">Step into the pulse of anime.</p>

      <form onSubmit={handleLogin} className="bg-[#2f2f31] p-6 rounded-lg shadow-md w-full max-w-sm space-y-4 border border-[#6B4CA0]">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded bg-[#1D1D1F] border border-[#2FFFE2] focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded bg-[#1D1D1F] border border-[#2FFFE2] focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-[#FF5DA2] text-black py-2 rounded hover:bg-pink-400 transition font-semibold">
          Log In
        </button>

        {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}

        {showResend && (
          <div className="text-center text-sm mt-2">
            <button
              type="button"
              className="text-[#2FFFE2] underline"
              onClick={async () => {
                setResendStatus('')
                const { error } = await supabase.auth.resend({ type: 'signup', email: emailToResend! })
                setResendStatus(error ? 'Failed to resend.' : 'Confirmation email sent!')
              }}
            >
              Resend Confirmation Email
            </button>
            {resendStatus && <p className="mt-1">{resendStatus}</p>}
          </div>
        )}
      </form>

      <p className="mt-4 text-sm">
        Don&apos;t have an account? <Link href="/signup" className="text-[#2FFFE2] underline">Sign Up</Link>
      </p>
    </div>
  )
}