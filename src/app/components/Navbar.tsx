'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      {}
      <div className="flex items-center space-x-3">
        <Image src="/logo-placeholder.jpg" alt="Logo" width={40} height={40} />
        <span className="text-xl font-bold">AniVex</span>
      </div>

      {}
      <div className="hidden md:flex space-x-6 text-sm">
        <Link href="/" className="hover:text-emerald-400">Recommended</Link>
        <Link href="/popular" className="hover:text-emerald-400">Popular</Link>
        <Link href="/trending" className="hover:text-emerald-400">Trending</Link>
        <Link href="/upcoming" className="hover:text-emerald-400">Upcoming</Link>
      </div>

      {}
      <div className="relative">
        {user ? (
          <div className="flex items-center space-x-3">
            {}
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <Image
                src="/pfp-placeholder.png"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border border-white"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-12 w-48 bg-white text-black rounded shadow-md z-50">
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Account Settings</Link>
                <Link href="/language" className="block px-4 py-2 hover:bg-gray-100">Language</Link>
                <Link href="/help" className="block px-4 py-2 hover:bg-gray-100">Help Center</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="hover:text-emerald-400">Sign In</Link>
            <Link href="/signup" className="hover:text-emerald-400">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}