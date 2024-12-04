'use client'

import Image from 'next/image'
import { Clock, HardDrive, Link } from 'lucide-react'

interface GameResult {
  name: string
  image?: string
  sources: { 
    name: string
    url: string
    fileSize?: string
    uploadDate?: string
  }[]
}

export default function GameResult({ game }: { game: GameResult }) {
  const shortTitle = game.name.split(/[-–([\]]|\sv\d/)[0].trim()

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('URL copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy URL:', err)
      })
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[400px] relative group">
          {game.image ? (
            <div className="relative h-[250px] lg:h-full">
              <Image
                src={game.image}
                alt={shortTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="w-full h-[250px] lg:h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <span className="text-purple-400 font-medium">No image available</span>
            </div>
          )}
        </div>

        <div className="flex-grow p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200">
              {shortTitle}
            </h2>
            <p className="text-sm text-gray-600 break-words">
              {game.name !== shortTitle && game.name}
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {game.sources.map((source, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-4 hover:bg-purple-50 transition-colors duration-200"
              >
                <button
                  onClick={() => handleCopyUrl(source.url)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-2 transition-colors duration-200"
                >
                  <Link className="w-4 h-4" />
                  {source.name}
                </button>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {source.fileSize && (
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-4 h-4" />
                      <span>{source.fileSize}</span>
                    </div>
                  )}
                  {source.uploadDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(source.uploadDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

