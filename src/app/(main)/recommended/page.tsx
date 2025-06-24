'use client'

import ProtectedRoute from "@/app/components/ProtectedRoute"

export default function RecommendedPage() {
  return (
    <ProtectedRoute>
      <>
        <main className="p-6">
          <h1 className="text-2xl font-bold">Recommended Anime</h1>
          <p className="mt-2 text-gray-600">This is the placeholder for the recommended anime page.</p>
        </main>
      </>
    </ProtectedRoute>  
  );
}