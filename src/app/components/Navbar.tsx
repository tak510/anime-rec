'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/app/hooks/useAuth'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      {}
      <div className="flex items-center space-x-3">
        <Link href="/"><Image src="/av_logo.png" alt="Anivex" width={80} height={80} /> </Link>
        <span className="text-xl font-bold">Anivex</span>
      </div>

      {}
      <div className="hidden md:flex space-x-6 text-sm">
        <Link href="/recommended" className="hover:text-emerald-400">Recommended</Link>
        <Link href="/popular" className="hover:text-emerald-400">Popular</Link>
        <Link href="/trending" className="hover:text-emerald-400">Trending</Link>
        <Link href="/upcoming" className="hover:text-emerald-400">Upcoming</Link>
      </div>

      {}
      <div className="relative">
        {!user ? (
          <>
            <Link href="/login" className="hover:text-emerald-400">Sign In</Link>
            <Link href="/signup" className="hover:text-emerald-400">Register</Link>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </nav>
  )
}