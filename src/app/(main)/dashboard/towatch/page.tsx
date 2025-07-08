'use client'

/*
import { useEffect, useState } from 'react'
import { getWatchedAnime } from '@/lib/supabase'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Image from 'next/image'
import { WatchedAnime } from '@/lib/types'
import WatchedAnimeModal from '@/app/(main)/dashboard/components/WatchedAnimeModal'

export default function WatchedPage() {
  const [watchedList, setWatchedList] = useState<WatchedAnime[]>([])
  const [selectedAnime, setSelectedAnime] = useState<WatchedAnime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getWatchedAnime()
      setWatchedList(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const refreshWatchedList = async () => {
    setLoading(true)
    const data = await getWatchedAnime()
    setWatchedList(data)
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-white px-6 py-8">
        
      </main>
    </ProtectedRoute>
  )
}
  */