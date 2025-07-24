'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/app/hooks/useAuth'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 bg-[#1D1D1F] text-[#F5EDF7] shadow-lg relative z-50"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      {/* Logo + Site Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/av_logo.png"
              alt="Anivex"
              width={60}
              height={60}
              className="rounded-full shadow-md shadow-[#2FFFE2]/40 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[#FF5DA2]/60"
            />
          </Link>
          <span className="text-2xl font-extrabold text-[#FF5DA2] tracking-wider">
            Anivex
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-base">
        {[
          { name: 'Recommended For You', href: '/recommended' },
          { name: 'Popular', href: '/popular' },
          { name: 'Trending', href: '/trending' },
          { name: 'Seasonal', href: '/seasonal' },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="
              relative py-1 text-[#F5EDF7] hover:text-[#2FFFE2]
              transition-all duration-300 ease-in-out
              after:absolute after:bottom-[-4px] after:left-1/2 after:w-0 after:h-[2px]
              after:bg-[#2FFFE2] after:rounded-full
              after:transition-all after:duration-300 after:ease-in-out
              hover:after:w-full hover:after:left-0
              hover:drop-shadow-[0_0_5px_rgba(47,255,226,0.5)]
            "
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Auth Buttons or Profile */}
      <div className="relative flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="
                px-5 py-2 rounded-lg bg-[#6B4CA0] text-[#F5EDF7] text-sm font-semibold
                transition-all duration-300 ease-in-out
                hover:bg-[#2FFFE2] hover:text-[#1D1D1F]
                hover:shadow-md hover:shadow-[#2FFFE2]/50
                border border-[#6B4CA0] hover:border-[#2FFFE2]
                transform hover:-translate-y-0.5
              "
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="
                px-5 py-2 rounded-lg bg-[#FF5DA2] text-[#1D1D1F] text-sm font-semibold
                transition-all duration-300 ease-in-out
                hover:bg-[#2FFFE2] hover:text-[#1D1D1F]
                hover:shadow-md hover:shadow-[#2FFFE2]/50
                border border-[#FF5DA2] hover:border-[#2FFFE2]
                transform hover:-translate-y-0.5
              "
            >
              Register
            </Link>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button className="text-[#F5EDF7] hover:text-[#2FFFE2] transition-colors duration-300 focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  )
}