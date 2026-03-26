export interface SearchResult {
  itunesId: number;
  title: string;
  artist: string;
  year: string;
  artworkUrl: string;
}

export interface Track {
  position: number;
  title: string;
  durationMs: number | null;
  appleMusicUrl: string | null;
  lyrics: string | null;
}

export interface WikiSection {
  title: string;
  content: string;
  level: number;
}

export interface WikiContent {
  intro: string;
  sections: WikiSection[];
  pageUrl: string | null;
}

export interface Palette {
  vibrant: string | null;
  darkVibrant: string | null;
  muted: string | null;
  darkMuted: string | null;
  lightVibrant: string | null;
  lightMuted: string | null;
}

export interface Album {
  itunesId: number;
  title: string;
  artist: string;
  releaseYear: string;
  releaseDate: string | null;
  label: string | null;
  genre: string | null;
  artworkUrl: string;
  appleMusicUrl: string | null;
  purchaseLinks: {
    amazonDe: string;
    qobuz: string;
  };
  palette: Palette;
  tracks: Track[];
  wikipedia: WikiContent | null;
  totalTracks: number;
}
