'use client'

import { searchGames } from '../lib/searchGames'
import SearchBar from '@/components/SearchBar'
import GameResult from '@/components/GameResult'
import { ArrowLeft, Calendar, HardDrive } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { GameData } from '../lib/searchGames'
import Link from 'next/link'

type SortType = 'date' | 'size'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<GameData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [sortedResults, setSortedResults] = useState<GameData[]>([])
  
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setIsLoading(true)
      searchGames(query)
        .then(setResults)
        .finally(() => setIsLoading(false))
    }
  }, [searchParams])

  useEffect(() => {
    const sorted = [...results].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.sources[0]?.uploadDate ? new Date(a.sources[0].uploadDate).getTime() : 0
        const dateB = b.sources[0]?.uploadDate ? new Date(b.sources[0].uploadDate).getTime() : 0
        return dateB - dateA
      } else {
        const sizeA = parseFloat(a.sources[0]?.fileSize?.replace(' GB', '') || '0')
        const sizeB = parseFloat(b.sources[0]?.fileSize?.replace(' GB', '') || '0')
        return sizeB - sizeA
      }
    })
    setSortedResults(sorted)
  }, [results, sortBy])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <Link 
              href="/"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <SearchBar onSearch={handleSearch} />
          </div>

          {results.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={() => setSortBy('date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  sortBy === 'date' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Calendar size={16} />
                Date
              </button>
              <button
                onClick={() => setSortBy('size')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  sortBy === 'size' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <HardDrive size={16} />
                Size
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Searching...</p>
            </div>
          ) : sortedResults.length > 0 ? (
            <>
              <h2 className="text-white text-xl mb-6">
                Found {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''}
                {searchParams.get('q') && ` for "${searchParams.get('q')}"`}
              </h2>
              {sortedResults.map((game, index) => (
                <GameResult key={index} {...game} />
              ))}
            </>
          ) : searchParams.get('q') ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">
                No results found for "{searchParams.get('q')}"
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

