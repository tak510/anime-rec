'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        router.replace('/') // Redirect to login
      } else {
        setUserEmail(data.session.user.email ?? null)
      }

      setLoading(false)
    }

    checkSession()
  }, [router])

  if (loading) return <p>Loading...</p>

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            alert(error.message);
        } else {
            router.push('login')
        }
    };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2 text-gray-600">Logged in as: {userEmail}</p>
      <div>
        <button 
        type='button'
        className="text-white bg-red-500  hover:bg-red-700 rounded p-2"
        onClick={ handleLogout }
        >
            Log Out
        </button>
    </div>
    </div>
  )
}