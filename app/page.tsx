'use client'

import SearchBar from '@/components/SearchBar'
import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    // Add any additional search logic here
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-6xl font-bold text-white mb-8">Is it on Hydra?</h1>
      <SearchBar onSearch={handleSearch} />
    </main>
  )
}

