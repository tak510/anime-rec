'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [isVerified, setIsVerified] = useState(true)
  const [resendStatus, setResendStatus] = useState('')

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: userData, error } = await supabase.auth.getUser()
      if (error || !userData?.user) return

      const confirmed = !!userData.user.email_confirmed_at
      setIsVerified(confirmed)
    }

    if (!loading && user) {
      checkEmailVerification()
    }
  }, [loading, user])

  if (loading) return null

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert(error.message)
    } else {
      router.push('/login')
    }
  }

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2 text-gray-600">Logged in as: {user}</p>

      {!isVerified && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          <p>Your email has not been verified. Please check your inbox to confirm.</p>
          <button
            onClick={handleResend}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
          >
            Resend Confirmation Email
          </button>
          {resendStatus && <p className="text-sm mt-2">{resendStatus}</p>}
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          className="text-white bg-red-500 hover:bg-red-700 rounded p-2"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}