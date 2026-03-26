import { Album, Track } from '../types';
import { getAlbumById } from '../services/itunes';
import { getReleaseInfo } from '../services/musicbrainz';
import { getAlbumWikipedia } from '../services/wikipedia';
import { getLyrics } from '../services/lyrics';
import { extractPalette } from '../services/colorExtractor';

function buildPurchaseLinks(title: string, artist: string) {
  const query = encodeURIComponent(`${artist} ${title}`);
  return {
    amazonDe: `https://www.amazon.de/s?k=${query}&i=music`,
    qobuz: `https://www.qobuz.com/de-de/search?q=${query}&search-target=albums`,
  };
}

export async function aggregateAlbum(itunesId: number): Promise<Album> {
  // Step 1: get base data from iTunes
  const base = await getAlbumById(itunesId);

  // Step 2: fan out in parallel (MusicBrainz, Wikipedia, palette, lyrics)
  const [mbInfo, wikipedia, palette, tracksWithLyrics] = await Promise.all([
    getReleaseInfo(base.title, base.artist),
    getAlbumWikipedia(base.title, base.artist),
    extractPalette(base.artworkUrl),
    fetchAllLyrics(base.artist, base.tracks),
  ]);

  return {
    itunesId: base.itunesId,
    title: base.title,
    artist: base.artist,
    releaseYear: base.releaseYear,
    releaseDate: mbInfo?.releaseDate ?? base.releaseDate,
    label: mbInfo?.label ?? null,
    genre: base.genre,
    artworkUrl: base.artworkUrl,
    appleMusicUrl: base.appleMusicUrl,
    purchaseLinks: buildPurchaseLinks(base.title, base.artist),
    palette,
    tracks: tracksWithLyrics,
    wikipedia,
    totalTracks: base.totalTracks,
  };
}

async function fetchAllLyrics(
  artist: string,
  tracks: Track[],
): Promise<Track[]> {
  // Fetch lyrics for up to 20 tracks concurrently, best-effort
  const MAX_CONCURRENT = 4;
  const results: Track[] = new Array(tracks.length);

  for (let i = 0; i < tracks.length; i += MAX_CONCURRENT) {
    const batch = tracks.slice(i, i + MAX_CONCURRENT);
    const batchResults = await Promise.allSettled(
      batch.map((t) => getLyrics(artist, t.title)),
    );
    batchResults.forEach((r, j) => {
      results[i + j] = {
        ...batch[j],
        lyrics:
          r.status === 'fulfilled' && r.value ? r.value : null,
      };
    });
  }

  return results;
}
