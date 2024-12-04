'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isMobileSearch?: boolean
}

export default function SearchBar({ onSearch, isMobileSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query')?.toString() || ''
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          name="query"
          placeholder="Search for any game..."
          className={`w-full bg-zinc-900/50 border border-zinc-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-white placeholder-zinc-400 transition-all duration-200 rounded-xl
            ${isMobileSearch 
              ? 'pl-12 pr-12 sm:pl-12 sm:pr-4 py-3' // Mobile: space for back arrow and search icon
              : 'pl-12 pr-4 py-3' // Desktop: original layout
            }`}
        />
        {/* Search icon */}
        <div className={`absolute top-1/2 -translate-y-1/2 text-zinc-400
          ${isMobileSearch 
            ? 'right-4 sm:left-4' // Mobile: move to right, Desktop: stay on left
            : 'left-4' // Default position for non-mobile
          }`}
        >
          <Search className="w-5 h-5" />
        </div>
      </div>
    </form>
  )
}

