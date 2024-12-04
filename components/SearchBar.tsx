'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query')?.toString() || ''
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
      <input
        type="text"
        name="query"
        placeholder="Search games..."
        className="w-full p-2 pr-12 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black bg-white"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-purple-500"
      >
        <Search size={20} />
      </button>
    </form>
  )
}

