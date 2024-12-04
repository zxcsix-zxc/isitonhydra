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

function cleanGameTitle(title: string): string {
  // Specific game mappings
  const specificGames: { [key: string]: string } = {
    'Resident.Evil.4': 'Resident Evil 4',
    'Resident.Evil.4.Crackfix': 'Resident Evil 4',
    'Resident.Evil.Village': 'Resident Evil Village',
    'Resident Evil Village': 'Resident Evil Village',
    'I Am Your President': 'I Am President',
  };

  for (const [pattern, replacement] of Object.entries(specificGames)) {
    if (title.toLowerCase().includes(pattern.toLowerCase())) {
      return replacement;
    }
  }

  return title
    .replace(/\[(.*?)\]|\((.*?)\)/g, '')
    .replace(/v\d+(\.\d+)*/, '')
    .replace(/(-|\s)+(Gold Edition|Deluxe Edition|MULTI\d+|Windows \d+ Fix|Bonus OST|DLCs|Bonus Content|Repack|Selective Download|from \d+(\.\d+)? GB|Animation|Fix|Crackfix)/gi, '')
    .replace(/\[FitGirl\]|\[FitGirl Repack\]|FitGirl Repack/gi, '')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
        
        if (!consolidatedGames.has(cleanTitle)) {
          const imageUrl = await getGameImage(cleanTitle);
          
          consolidatedGames.set(cleanTitle, {
            name: download.title,
            cleanName: cleanTitle,
            image: imageUrl,
            sources: [],
            largestSize: download.fileSize,
            mostRecentDate: download.uploadDate
          });
        }

        const game = consolidatedGames.get(cleanTitle)!;
        game.sources.push({
          name: source.name,
          url: download.uris?.[0] || '',
          fileSize: download.fileSize,
          uploadDate: download.uploadDate
        });

        if (parseFileSize(download.fileSize) > parseFileSize(game.largestSize)) {
          game.largestSize = download.fileSize;
        }

        if (new Date(download.uploadDate) > new Date(game.mostRecentDate)) {
          game.mostRecentDate = download.uploadDate;
        }
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
    }
  }

  return Array.from(consolidatedGames.values()).map(game => ({
    name: cleanGameName(game.cleanName),
    image: game.image,
    sources: game.sources
  }));
}

function parseFileSize(size: string): number {
  const match = size.match(/^([\d.]+)\s*(MB|GB)$/i);
  if (!match) return 0;
  const [, value, unit] = match;
  return unit.toUpperCase() === 'GB' ? parseFloat(value) * 1024 : parseFloat(value);
}

