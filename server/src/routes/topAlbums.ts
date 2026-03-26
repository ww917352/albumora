import { Router, Request, Response } from 'express';

const router = Router();

const APPLE_RSS = 'https://rss.marketingtools.apple.com/api/v2/us/music/most-played/5/albums.json';

router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(APPLE_RSS);
    if (!response.ok) throw new Error(`Apple RSS status ${response.status}`);
    const data: any = await response.json();
    const results: any[] = data?.feed?.results ?? [];
    const albums = results.slice(0, 5).map((r) => ({
      name: r.name,
      artist: r.artistName,
      artworkUrl: (r.artworkUrl100 as string).replace(/\d+x\d+bb/, '400x400bb'),
      url: r.url,
    }));
    res.json({ albums });
  } catch (err) {
    console.error('Top albums fetch error:', err);
    res.status(502).json({ error: 'Failed to fetch top albums' });
  }
});

export default router;
