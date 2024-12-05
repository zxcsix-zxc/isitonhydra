import { jsonSources } from '../config/sources'
import { getGameImage } from './steamUtils'

export interface GameData {
  name: string
  image?: string
  sources: { 
    name: string
    url: string
    fileSize?: string
    uploadDate?: string
  }[]
}

interface Download {
  title: string
  uris: string[]
  uploadDate: string
  fileSize: string
}

interface SourceData {
  name: string
  downloads: Download[]
}

interface ConsolidatedGame {
  name: string
  cleanName: string
  image?: string
  sources: {
    name: string
    url: string
    fileSize: string
    uploadDate: string
  }[]
  largestSize: string
  mostRecentDate: string
}

const GAME_TITLE_MAPPINGS: { [key: string]: string[] } = {
  'Red Dead Redemption 2': ['red dead redemption 2', 'red dead redemption 2 ultimate edition', 'red dead redemption 2 free download', 'red dead redemption 2 От Decepticon', 'Red Dead Redemption Ii'],
  'Resident Evil 4': ['resident evil 4', 'resident evil 4 remake', 'resident evil 4 gold edition'],
  'Resident Evil Village': ['resident evil village', 'resident evil 8', 'resident evil 8 village'],
  'I Am President': ['i am president', 'i am your president', 'this is the president'],
  'Dave the Diver': ['dave the diver', 'dave the diver free download', 'dave the diver V', 'dave the diver:'],
  // Add more mappings as needed
};

function cleanGameTitle(title: string): string {
  // First, apply basic cleaning
  let cleanTitle = title
    .replace(/\[(.*?)\]|\((.*?)\)/g, '')
    // Remove version patterns like "v1.0.3 1535" or "v 1 0 2 1474"
    .replace(/v\s*\d+(\s*\.\s*\d+)*\s*\d*/, '')
    // Remove just version numbers like "1.0.3" or "1535"
    .replace(/\b\d+(\.\d+)*\s*\d*\b/, '')
    .replace(/(-|\s)+(Gold Edition|Deluxe Edition|MULTI\d+|Windows \d+ Fix|Bonus OST|DLCs|Bonus Content|Repack|Selective Download|from \d+(\.\d+)? GB|Animation|Fix|Crackfix)/gi, '')
    .replace(/\[FitGirl\]|\[FitGirl Repack\]|FitGirl Repack/gi, '')
    .replace(/free download/gi, '')
    .replace(/ultimate edition/gi, '')
    .replace(/\./g, ' ')
    .replace(/-\s*\+\s*\d\s*\+/g, '') // Remove patterns like "- + 2 +"
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Check if this title matches any of our mappings
  for (const [standardTitle, variations] of Object.entries(GAME_TITLE_MAPPINGS)) {
    if (variations.some(variant => 
      cleanTitle.includes(variant.toLowerCase()) || 
      variant.toLowerCase().includes(cleanTitle)
    )) {
      return standardTitle;
    }
  }

  // If no mapping found, capitalize first letter of each word
  return cleanTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanGameName(name: string): string {
  return name
    .replace(/free download/gi, '')
    .replace(/v\d+\.\d+(\.\d+)?/gi, '') // Removes version numbers like v1.0, v1.4.5
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim()
}

export async function searchGames(query: string): Promise<GameData[]> {
  const consolidatedGames = new Map<string, ConsolidatedGame>();

  for (const source of jsonSources) {
    try {
      const response = await fetch(source.url, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: SourceData = await response.json();
      
      const matchingDownloads = data.downloads
        .filter((download) => download.title.toLowerCase().includes(query.toLowerCase()));

      for (const download of matchingDownloads) {
        const cleanTitle = cleanGameTitle(download.title);
        const normalizedTitle = cleanTitle.toLowerCase();
        
        if (!consolidatedGames.has(normalizedTitle)) {
          const imageUrl = await getGameImage(cleanTitle);
          
          consolidatedGames.set(normalizedTitle, {
            name: cleanTitle,
            cleanName: normalizedTitle,
            image: imageUrl,
            sources: [],
            largestSize: '0 GB',
            mostRecentDate: '1970-01-01'
          });
        }

        const game = consolidatedGames.get(normalizedTitle)!;
        
        // Check for duplicate sources
        const sourceExists = game.sources.some(existingSource => 
          existingSource.name === source.name &&
          existingSource.fileSize === download.fileSize &&
          existingSource.uploadDate === download.uploadDate &&
          existingSource.url === (download.uris?.[0] || '')
        );

        if (!sourceExists) {
          game.sources.push({
            name: source.name,
            url: download.uris?.[0] || '',
            fileSize: download.fileSize,
            uploadDate: download.uploadDate
          });

          const currentSize = parseFileSize(download.fileSize);
          const largestSize = parseFileSize(game.largestSize);
          if (currentSize > largestSize) {
            game.largestSize = download.fileSize;
          }

          const currentDate = new Date(download.uploadDate);
          const mostRecentDate = new Date(game.mostRecentDate);
          if (currentDate > mostRecentDate) {
            game.mostRecentDate = download.uploadDate;
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
    }
  }

  return Array.from(consolidatedGames.values()).map(game => ({
    name: game.name,
    image: game.image,
    sources: game.sources.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }));
}

function parseFileSize(size: string): number {
  const match = size.match(/^([\d.]+)\s*(MB|GB)$/i);
  if (!match) return 0;
  const [, value, unit] = match;
  return unit.toUpperCase() === 'GB' ? parseFloat(value) * 1024 : parseFloat(value);
}

