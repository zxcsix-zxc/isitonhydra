'use client'

import { searchGames } from '../lib/searchGames'
import SearchBar from '@/components/SearchBar'
import GameResult from '@/components/GameResult'
import { ArrowLeft, Calendar, HardDrive, Search, AlertTriangle, Github, MessageSquare } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { GameData } from '../lib/searchGames'
import Link from 'next/link'

type SortType = 'date' | 'size'

function SearchContent() {
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
    const sorted = [...results].map(game => ({
      ...game,
      sources: [...game.sources].sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        } else {
          const sizeA = parseFileSize(a.fileSize || '0 MB');
          const sizeB = parseFileSize(b.fileSize || '0 MB');
          return sizeB - sizeA;
        }
      })
    })).sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = Math.max(...a.sources.map(s => new Date(s.uploadDate || 0).getTime()));
        const dateB = Math.max(...b.sources.map(s => new Date(s.uploadDate || 0).getTime()));
        return dateB - dateA;
      } else {
        const sizeA = Math.max(...a.sources.map(s => parseFileSize(s.fileSize || '0 MB')));
        const sizeB = Math.max(...b.sources.map(s => parseFileSize(s.fileSize || '0 MB')));
        return sizeB - sizeA;
      }
    });

    setSortedResults(sorted);
  }, [results, sortBy]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-4 sm:pt-8 pb-24">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 mb-8 sm:mb-12 w-full">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            {/* Hide on mobile, show on desktop */}
            <Link 
              href="/"
              className="hidden sm:block text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-full relative">
              {/* Show on mobile, hide on desktop */}
              <Link 
                href="/"
                className="absolute left-3 top-1/2 -translate-y-1/2 sm:hidden text-zinc-400 hover:text-white transition-colors z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <SearchBar onSearch={handleSearch} isMobileSearch />
            </div>
          </div>

          {/* Sort buttons */}
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => setSortBy('date')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                sortBy === 'date' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' 
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800/70'
              }`}
            >
              <Calendar size={16} />
              Date
            </button>
            <button
              onClick={() => setSortBy('size')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                sortBy === 'size' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' 
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800/70'
              }`}
            >
              <HardDrive size={16} />
              Size
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="w-full pb-24">
          {isLoading ? (
            <div className="text-center py-12 space-y-8">
              <div className="w-16 h-16 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">Searching...</p>
              
              <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 text-amber-500">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">Wait, it may take a while to search</p>
                </div>
              </div>
            </div>
          ) : sortedResults.length > 0 ? (
            <>
              <h2 className="text-zinc-200 text-xl mb-6">
                Found {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} 
                {searchParams.get('q') && (
                  <span className="text-zinc-400">
                    {' '}for "{searchParams.get('q')}"
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                {sortedResults.map((game, index) => (
                  <div key={index} className="p-4 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-xl transition-all duration-200 hover:bg-zinc-800/50">
                    <GameResult {...game} />
                  </div>
                ))}
              </div>
            </>
          ) : searchParams.get('q') ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">
                No results found for '{searchParams.get('q')}'
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <div className="relative min-h-screen">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="w-16 h-16 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">Loading...</p>
          </div>
        }>
          <SearchContent />
        </Suspense>

        {/* Footer - fixed to bottom left */}
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 text-zinc-500">
          <p className="text-sm font-medium select-none">Created by Moyase</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://discord.gg/hydralaunchercommunity" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/zxcsix-zxc/isitonhydra" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

