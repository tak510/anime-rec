'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
  if (
    dropdownRef.current &&
    !(dropdownRef.current as HTMLElement).contains(event.target as Node)
  ) {
    setIsOpen(false)
  }
}

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    localStorage.setItem('logout', 'true')
    const { error } = await supabase.auth.signOut()
    if (!error) router.push('/')
  }

  const goTo = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  if (user === null) return null

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold
          bg-[#6B4CA0] text-[#F5EDF7] transition-all duration-300 ease-in-out
          hover:bg-[#2FFFE2] hover:text-[#1D1D1F] hover:shadow-md hover:shadow-[#2FFFE2]/50
          border border-[#6B4CA0] hover:border-[#2FFFE2]
          transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FFFE2]
        "
        style={{ fontFamily: "'Inter', sans-serif" }}
        aria-expanded={isOpen}
      >
        <Image
          src={user.user_metadata?.avatar_url || "/default_pfp.png"}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full mr-2 border-2 border-[#FF5DA2]"
        />
        {user.user_metadata?.full_name || user.email || 'Profile'}
        <svg
          className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-56 origin-top-right bg-[#1D1D1F] border border-[#6B4CA0]
            divide-y divide-[#6B4CA0] rounded-md shadow-lg ring-1 ring-black ring-opacity-5
            animate-fade-in-scale z-20
          "
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="py-1">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Account Settings', href: '/settings' },
              { label: 'Help Center', href: '/help' },
            ].map(({ label, href }) => (
              <a
                key={label}
                onClick={() => goTo(href)}
                className="
                  block px-4 py-2 text-sm text-[#F5EDF7] cursor-pointer
                  hover:bg-[#6B4CA0] hover:text-[#2FFFE2]
                  transition-colors duration-200 rounded-md mx-2
                "
              >
                {label}
              </a>
            ))}
          </div>
          <div className="py-1">
            <div className ="pr-4">
              <button
                onClick={handleLogout}
                className="
                  block w-full text-left px-4 py-2 text-sm text-[#F5EDF7] cursor-pointer
                  hover:bg-[#FF5DA2] hover:text-[#1D1D1F]
                  transition-colors duration-200 rounded-md mx-2
                "
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}