'use client'

import SearchBar from '@/components/SearchBar'
import { useRouter } from 'next/navigation'
import { Github, MessageSquare, Search, Zap, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-28 sm:p-8 sm:pb-28 md:p-24 md:pb-28">
          <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Is it on Hydra?
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto px-4">
              Your ultimate game search engine. Fast, reliable, and always up to date.
            </p>
          </div>

          <div className="w-full max-w-2xl mb-8 sm:mb-16 px-4">
            <div className="p-3 sm:p-4 bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-xl">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full px-4 mb-8">
            <div className="p-4 sm:p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm select-none">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-zinc-400">Get instant results with our optimized search engine</p>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm select-none">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
              <p className="text-zinc-400">Advanced filtering and sorting capabilities</p>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-zinc-800/30 border border-zinc-700/50 backdrop-blur-sm select-none">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Reliable</h3>
              <p className="text-zinc-400">Always up-to-date with verified sources</p>
            </div>
          </div>

          {/* Quick Tip Box - moved below cards */}
          <div className="w-full max-w-lg mx-auto">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3 text-blue-400">
                <div className="p-1">💡</div>
                <div>
                  <p className="text-sm font-medium mb-2">Quick Tips</p>
                  <ul className="text-xs text-blue-300 space-y-1">
                    <li>• Type any game name in the search bar above</li>
                    <li>• Find games by their full name or partial matches</li>
                    <li>• Use Date/Size filters to sort your results</li>
                    <li>• Click on any source name to copy its link</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - now using fixed positioning */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pt-8">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 text-zinc-500">
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
    </main>
  )
}

