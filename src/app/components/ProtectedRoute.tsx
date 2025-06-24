'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/hooks/useAuth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [isVerified, setIsVerified] = useState(true)
  const [resendStatus, setResendStatus] = useState('')
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const logoutFlag = localStorage.getItem('logout')

    if (!loading && !user) {
      if (logoutFlag) {
        localStorage.removeItem('logout')
      } else {
        router.push('/login') // Only redirect if NOT a logout
      }
    }

    if (!loading && user) {
      setShouldRender(true) // allow render after auth check
    }
  }, [loading, user, router])

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) return

      const confirmed = !!data.user.email_confirmed_at
      setIsVerified(confirmed)
    }

    if (!loading && user) {
      checkEmailVerification()
    }
  }, [loading, user])

  const handleResend = async () => {
    const { data } = await supabase.auth.getUser()
    const email = data.user?.email
    if (!email) {
      setResendStatus('Could not find email. Please log in again.')
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      setResendStatus('Failed to resend confirmation email.')
    } else {
      setResendStatus('Confirmation email sent successfully!')
    }
  }

  if (loading || !shouldRender) return null

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-2xl font-semibold text-red-400">Email Not Verified</h2>
        <p className="mt-2">Please check your inbox to verify your email address before accessing this page.</p>
        <button
          onClick={handleResend}
          className="mt-4 px-4 py-2 bg-[#2FFFE2] text-black rounded hover:opacity-90 transition"
        >
          Resend Confirmation Email
        </button>
        {resendStatus && <p className="mt-2 text-sm text-yellow-400">{resendStatus}</p>}
      </div>
    )
  }
  return <>{children}</>
}