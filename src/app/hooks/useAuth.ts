'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!error && data.session) {
        setUser(data.session.user.email ?? null)
      }

      setLoading(false)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user.email ?? null)
      } else {
        setUser(null)
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}