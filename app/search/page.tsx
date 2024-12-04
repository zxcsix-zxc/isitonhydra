'use client'

import { searchGames } from '../lib/searchGames'
import SearchBar from '@/components/SearchBar'
import GameResult from '@/components/GameResult'
import { Clock, HardDrive, SortAsc, SortDesc } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { GameData } from '../lib/searchGames'

type SortType = 'date' | 'size'
type SortDirection = 'asc' | 'desc'

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  const [results, setResults] = useState<GameData[]>([])
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const query = searchParams.q

  useEffect(() => {
    const fetchResults = async () => {
      const data = await searchGames(query)
      setResults(data)
    }
    if (query) {
      fetchResults()
    }
  }, [query])

  const toggleSort = (type: SortType) => {
    if (sortBy === type) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(type)
      setSortDirection('desc')
    }
  }

  const parseFileSize = (size?: string): number => {
    if (!size) return 0
    const match = size.match(/^([\d.]+)\s*(MB|GB)$/i)
    if (!match) return 0
    const [, value, unit] = match
    return unit.toUpperCase() === 'GB' ? parseFloat(value) * 1024 : parseFloat(value)
  }

  const sortedResults = [...results].sort((a, b) => {
    const getMaxValue = (game: any, getValue: (source: any) => number) => {
      return Math.max(...game.sources.map(getValue))
    }

    if (sortBy === 'date') {
      const dateA = getMaxValue(a, (source) => new Date(source.uploadDate || 0).getTime())
      const dateB = getMaxValue(b, (source) => new Date(source.uploadDate || 0).getTime())
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      const sizeA = getMaxValue(a, (source) => parseFileSize(source.fileSize))
      const sizeB = getMaxValue(b, (source) => parseFileSize(source.fileSize))
      return sortDirection === 'desc' ? sizeB - sizeA : sizeA - sizeB
    }
  })

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Is it on Hydra?</h1>
        <div className="mb-8">
          <SearchBar />
          {results.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => toggleSort('size')}
                className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                  sortBy === 'size' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                Size
                {sortBy === 'size' && (
                  sortDirection === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => toggleSort('date')}
                className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                  sortBy === 'date' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Clock className="w-4 h-4" />
                Date
                {sortBy === 'date' && (
                  sortDirection === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>
        {sortedResults.length > 0 ? (
          <div className="space-y-8">
            {sortedResults.map((game, index) => (
              <GameResult key={index} game={game} />
            ))}
          </div>
        ) : (
          query && <p className="text-center text-xl text-white">No results found for &quot;{query}&quot;. The game is not available right now.</p>
        )}
      </div>
    </div>
  )
}

