'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function LoadingConfirmPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')

  const handleResendConfirmation = async () => {
    setMessage(null)
    setError(null)

    if (!email) {
      setError('No email found. Please return to signup.')
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Confirmation email resent successfully!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1D1D1F] text-[#F5EDF7] px-6">
      {/* Logo */}
      <div
        onClick={() => router.push('/')}
        className="cursor-pointer flex items-center space-x-3 mb-8"
      >
        <Image src="/av_logo.png" alt="Anivex Logo" width={60} height={60} />
        <span className="text-2xl font-orbitron text-[#FF5DA2]">Anivex</span>
      </div>

      <div className="bg-[#2f2f31] border border-[#2FFFE2] max-w-xl w-full p-8 rounded-lg text-center shadow-md">
        <div className="flex justify-center mb-4">
          <EnvelopeIcon className="h-10 w-10 text-[#2FFFE2]" />
        </div>
        <h1 className="text-2xl font-orbitron mb-2 text-[#2FFFE2]">
          Verify Your Email
        </h1>
        <p className="text-sm text-[#F5EDF7] mb-6">
          A confirmation email has been sent to <span className="text-[#FF5DA2] font-semibold">{email}</span>.  
          Please check your inbox (and spam folder) to complete your registration.
        </p>

        <p className="text-sm mb-6">
          Didn&apos;t receive an email? Click below to resend.
        </p>

        <button
          type="button"
          className="bg-[#2FFFE2] text-black font-semibold px-6 py-2 rounded hover:bg-[#1DE9D3] transition"
          onClick={handleResendConfirmation}
        >
          Resend Confirmation Email
        </button>

        {message && <p className="text-green-400 mt-4">{message}</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      {/* Back to login */}
      <p className="mt-6 text-sm text-[#F5EDF7]">
        Already confirmed?{' '}
        <span
          onClick={() => router.push('/login')}
          className="text-[#2FFFE2] underline hover:text-[#1DE9D3] cursor-pointer"
        >
          Log in here
        </span>
      </p>
    </div>
  )
}