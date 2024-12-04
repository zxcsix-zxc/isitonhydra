'use client'

import { searchGames } from '../lib/searchGames'
import SearchBar from '@/components/SearchBar'
import GameResult from '@/components/GameResult'
import { Clock, HardDrive, SortAsc, SortDesc } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { GameData } from '../lib/searchGames'

type SortType = 'date' | 'size'
type SortDirection = 'asc' | 'desc'

export default function SearchPage() {
  const [results, setResults] = useState<GameData[]>([])
  const [query, setQuery] = useState<string>('')
  const [sortType, setSortType] = useState<SortType>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim()) {
        const data = await searchGames(query)
        setResults(data)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query])

  const toggleSort = (type: SortType) => {
    if (sortType === type) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortType(type)
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

    if (sortType === 'date') {
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
    <main className="container mx-auto p-4">
      <SearchBar onSearch={setQuery} />
      {sortedResults.length > 0 ? (
        <div className="space-y-8">
          {sortedResults.map((game, index) => (
            <GameResult key={index} game={game} />
          ))}
        </div>
      ) : (
        query && <p className="text-center text-xl text-white">No results found for &quot;{query}&quot;. The game is not available right now.</p>
      )}
    </main>
  )
}

