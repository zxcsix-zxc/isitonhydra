const KNOWN_GAME_IDS: { [key: string]: string } = {
  'Resident Evil 4': '2050650',
  'Resident Evil Village': '1196590',
  'I Am President': '2179800',
  'Resident Evil 3': '952060',
  'Resident Evil 2': '883710',
  'Resident Evil 7': '418370',
  'This Is the President': '2179800',
  'Red Dead Redemption': '1446780',
  'Red Dead Redemption 2': '1174180',
  'Red Dead Redemption 2: Ultimate Edition': '1174180'
};

const IGDB_ENDPOINT = 'https://api.igdb.com/v4/games';

export async function getGameImage(gameName: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/game-image?title=${encodeURIComponent(gameName)}`)
    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error('Error fetching game image:', error)
    return null
  }
}

// Function to verify if an image URL exists
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
} 