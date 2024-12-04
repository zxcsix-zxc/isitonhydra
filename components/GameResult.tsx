'use client'

import Image from 'next/image'

interface GameResultProps {
  name: string
  image?: string
  sources: { 
    name: string
    url: string
    fileSize?: string
    uploadDate?: string
  }[]
}

export default function GameResult({ name, image, sources }: GameResultProps) {
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).replace(/\//g, '/')
  }

  return (
    <div className="bg-purple-600/30 backdrop-blur-sm rounded-3xl shadow-lg hover:bg-purple-600/40 transition-all duration-200 p-6">
      <div className="flex gap-6">
        {image && (
          <div className="w-40 h-24 relative flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <button 
                key={index}
                onClick={() => handleCopyUrl(source.url)}
                className="flex items-center gap-2 text-white/90 hover:text-white"
              >
                <span>{source.name}</span>
                {source.fileSize && (
                  <>
                    <span className="text-white/60">•</span>
                    <span>{source.fileSize}</span>
                  </>
                )}
                {source.uploadDate && (
                  <>
                    <span className="text-white/60">•</span>
                    <span>{formatDate(source.uploadDate)}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

