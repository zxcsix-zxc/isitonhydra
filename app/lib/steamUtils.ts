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

export async function getGameImage(gameName: string): Promise<string | undefined> {
  try {
    const cleanName = gameName
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/v\d+(\.\d+)*/, '')
      .replace(/\./g, ' ')
      .replace(/-/g, ' ')
      .replace(/:/g, '')
      .replace(/ultimate edition|deluxe edition|gold edition|repack|crackfix/gi, '')
      .trim();

    const params = new URLSearchParams({ title: cleanName });
    const response = await fetch(`/api/game-image?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl || undefined;
  } catch (error) {
    console.error('Error fetching game image:', error);
    return undefined;
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