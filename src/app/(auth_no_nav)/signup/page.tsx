'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      if (!data.session || !data.user?.confirmed_at) {
        setSuccessMsg('Signup successful! Please check your email to confirm.')
        router.push(`/signup/loadconfirm?email=${encodeURIComponent(email)}`)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D1D1F] text-[#F5EDF7]">
      <div className="bg-[#2f2f31] rounded-lg p-8 w-full max-w-md shadow-md border border-[#FF5DA2]">
        <Link href="/" className="block text-center mb-6">
          <Image src="/av_logo.png" alt="Anivex Logo" width={80} height={80} className="mx-auto" />
        </Link>
        <h2 className="text-2xl font-orbitron text-center text-[#FF5DA2] mb-6">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center border rounded px-3 py-2 bg-[#1D1D1F]">
            <EnvelopeIcon className="w-5 h-5 text-[#2FFFE2] mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full text-[#F5EDF7]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border rounded px-3 py-2 bg-[#1D1D1F]">
            <LockClosedIcon className="w-5 h-5 text-[#2FFFE2] mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-[#F5EDF7]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <div className="text-sm text-[#F5EDF7] mt-1">
              🔒 Password must contain at least:
              <ul className="list-disc list-inside pl-2 text-xs text-[#FF5DA2]">
                <li>12 characters</li>
                <li>1 capital letter</li>
                <li>1 number</li>
                <li>1 special character</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5DA2] text-[#1D1D1F] py-2 rounded font-bold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        {errorMsg && <p className="text-red-500 mt-4 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-400 mt-4 text-sm">{successMsg}</p>}

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2FFFE2] hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}