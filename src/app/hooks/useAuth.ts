'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
        router.push('/login')
        } else {
        setUser(data.session.user.email ?? null)
        }

        setLoading(false)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            setUser(null)
            router.push('/login')
        } else {
            setUser(session.user.email ?? null)
        }
    })

    return () => {
        listener?.subscription.unsubscribe()
    }
    }, [router])

  return { user, loading }
}