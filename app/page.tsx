'use client'

import SearchBar from '@/components/SearchBar'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-6xl font-bold text-white mb-8">Is it on Hydra?</h1>
      <SearchBar onSearch={handleSearch} />
    </main>
  )
}

