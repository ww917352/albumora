import axios from 'axios';
import { SearchResult } from '../types';

const ITUNES_BASE = 'https://itunes.apple.com';

function upgradeArtwork(url: string, size = 600): string {
  return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}

export async function searchAlbums(query: string, limit = 10): Promise<SearchResult[]> {
  const res = await axios.get(`${ITUNES_BASE}/search`, {
    params: {
      term: query,
      entity: 'album',
      limit,
      media: 'music',
    },
  });

  return res.data.results.map((r: any) => ({
    itunesId: r.collectionId,
    title: r.collectionName,
    artist: r.artistName,
    year: r.releaseDate ? r.releaseDate.substring(0, 4) : '',
    artworkUrl: upgradeArtwork(r.artworkUrl100 || '', 300),
  }));
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
