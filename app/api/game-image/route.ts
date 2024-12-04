import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  try {
    // Clean the game name for search
    const searchName = title
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/v\d+(\.\d+)*/, '')
      .replace(/\./g, ' ')
      .replace(/-/g, ' ')
      .replace(/:/g, '')
      .replace(/ultimate edition|deluxe edition|gold edition|repack|crackfix/gi, '')
      .trim()

    // Search Steam store
    const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(searchName)}`
    const response = await fetch(searchUrl)
    const html = await response.text()

    // Parse HTML
    const root = parse(html)
    const firstResult = root.querySelector('[data-ds-appid]')
    const appId = firstResult?.getAttribute('data-ds-appid')

    if (appId) {
      const imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`
      return NextResponse.json({ imageUrl })
    }

    return NextResponse.json({ imageUrl: null })
  } catch (error) {
    console.error('Error fetching game image:', error)
    return NextResponse.json({ error: 'Failed to fetch game image' }, { status: 500 })
  }
} 