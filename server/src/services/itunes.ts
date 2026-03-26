import axios from 'axios';
import { SearchResult } from '../types';

const ITUNES_BASE = 'https://itunes.apple.com';

function upgradeArtwork(url: string, size = 600): string {
  return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}

function mapResult(r: any): SearchResult {
  return {
    itunesId: r.collectionId,
    title: r.collectionName,
    artist: r.artistName,
    year: r.releaseDate ? r.releaseDate.substring(0, 4) : '',
    artworkUrl: upgradeArtwork(r.artworkUrl100 || '', 300),
  };
}

async function artistAlbumSearch(artistTerm: string, albumTerm: string): Promise<any[]> {
  // Find the top artist matching artistTerm
  const artistRes = await axios.get(`${ITUNES_BASE}/search`, {
    params: { term: artistTerm, entity: 'musicArtist', limit: 1, media: 'music' },
  });
  const artist = artistRes.data.results[0];
  if (!artist) return [];

  // Look up all albums for that artist and filter by albumTerm
  const albumRes = await axios.get(`${ITUNES_BASE}/lookup`, {
    params: { id: artist.artistId, entity: 'album', limit: 200 },
  });
  const albumLower = albumTerm.toLowerCase();
  return albumRes.data.results.filter(
    (r: any) => r.wrapperType === 'collection' && r.collectionName.toLowerCase().includes(albumLower),
  );
}

export async function searchAlbums(query: string, limit = 10): Promise<SearchResult[]> {
  const words = query.trim().split(/\s+/);
  const queryLower = query.toLowerCase();
  const wordSet = new Set(words.map((w) => w.toLowerCase()));

  // Always run the basic album search
  const baseSearch = axios.get(`${ITUNES_BASE}/search`, {
    params: { term: query, entity: 'album', limit, media: 'music' },
  });

  // For multi-word queries, also try treating the first word as an artist name
  // and looking up their albums filtered by the rest (handles "Beck Mellow Gold")
  const artistSearch = words.length > 1
    ? artistAlbumSearch(words[0], words.slice(1).join(' '))
    : Promise.resolve([]);

  const [baseRes, artistResults] = await Promise.all([baseSearch, artistSearch]);
  const allRaw = [...baseRes.data.results, ...artistResults];

  const seen = new Set<number>();
  const raw: Array<{ result: SearchResult; score: number }> = [];

  for (const r of allRaw) {
    if (!r.collectionId || seen.has(r.collectionId)) continue;
    seen.add(r.collectionId);
    const combined = `${r.artistName} ${r.collectionName}`.toLowerCase();
    const artistLower = r.artistName.toLowerCase();
    let score = 0;
    for (const word of wordSet) {
      if (combined.includes(word)) score++;
    }
    if (combined.includes(queryLower)) score += words.length;
    if (queryLower.includes(artistLower)) score++;
    raw.push({ result: mapResult(r), score });
  }

  return raw
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.result);
}

export async function getAlbumById(itunesId: number) {
  const [collectionRes, trackRes] = await Promise.all([
    axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id: itunesId, entity: 'album' },
    }),
    axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id: itunesId, entity: 'song' },
    }),
  ]);

  const collection = collectionRes.data.results.find(
    (r: any) => r.wrapperType === 'collection',
  );
  if (!collection) throw new Error(`iTunes album ${itunesId} not found`);

  const tracks = trackRes.data.results
    .filter((r: any) => r.wrapperType === 'track' && r.kind === 'song')
    .sort((a: any, b: any) => a.trackNumber - b.trackNumber)
    .map((t: any) => ({
      position: t.trackNumber,
      title: t.trackName,
      durationMs: t.trackTimeMillis || null,
      appleMusicUrl: t.trackViewUrl || null,
      lyrics: null,
    }));

  return {
    itunesId: collection.collectionId,
    title: collection.collectionName,
    artist: collection.artistName,
    releaseYear: collection.releaseDate
      ? collection.releaseDate.substring(0, 4)
      : '',
    releaseDate: collection.releaseDate || null,
    genre: collection.primaryGenreName || null,
    artworkUrl: upgradeArtwork(collection.artworkUrl100 || '', 600),
    appleMusicUrl: collection.collectionViewUrl || null,
    totalTracks: collection.trackCount || tracks.length,
    tracks,
  };
}
