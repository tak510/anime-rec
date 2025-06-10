'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) return null

  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
          alert(error.message);
      } else {
          router.push('/login')
        }
    };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2 text-gray-600">Logged in as: {user}</p>
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