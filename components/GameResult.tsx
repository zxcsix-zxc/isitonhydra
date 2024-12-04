'use client'

import Image from 'next/image'
import { useState } from 'react'
import { jsonSources } from '@/app/config/sources'

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopyUrl = (sourceName: string, index: number) => {
    const sourceConfig = jsonSources.find(s => s.name.toLowerCase() === sourceName.toLowerCase())
    if (sourceConfig) {
      navigator.clipboard.writeText(sourceConfig.url)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
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
    <div className="bg-purple-600/30 backdrop-blur-sm rounded-3xl shadow-lg hover:bg-purple-600/40 transition-all duration-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {image && (
          <div className="w-full sm:w-80 h-48 sm:h-44 relative flex-shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-3 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{name}</h2>
          <div className="flex flex-col gap-2">
            {sources.map((source, index) => (
              <button 
                key={index}
                onClick={() => handleCopyUrl(source.name, index)}
                className="flex flex-wrap items-center gap-2 text-white/90 hover:text-white w-fit group relative text-sm sm:text-base"
              >
                <span className="relative">
                  {source.name}
                  {copiedIndex === index && (
                    <span className="absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-1 bg-green-500 text-xs rounded text-white whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </span>
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

