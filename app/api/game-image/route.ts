import { NextResponse } from 'next/server'
import steamGames from '@/data/steam-games.json'

interface SteamGame {
  id: string;
  name: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  try {
    // Search for the game in steam-games.json
    const steamGame = (steamGames as SteamGame[]).find(game => 
      game.name.toLowerCase() === title.toLowerCase() ||
      title.toLowerCase().includes(game.name.toLowerCase())
    );

    if (steamGame?.id) {
      const imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.id}/header.jpg`;
      return NextResponse.json({ imageUrl });
    }

    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error('Error finding game image:', error);
    return NextResponse.json({ error: 'Failed to find game image' }, { status: 500 });
  }
} 