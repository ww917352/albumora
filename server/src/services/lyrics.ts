import axios from 'axios';

export async function getLyrics(
  artist: string,
  title: string,
): Promise<string | null> {
  // Try lyrics.ovh
  try {
    const res = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      { timeout: 5000 },
    );
    if (res.data?.lyrics) return res.data.lyrics.trim();
  } catch {
    // fall through
  }

  return null;
}
