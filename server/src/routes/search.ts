import { Router, Request, Response } from 'express';
import { searchAlbums } from '../services/itunes';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const limit = Math.min(Number(req.query.limit) || 10, 25);

  if (!q) {
    res.json({ results: [] });
    return;
  }

  try {
    const results = await searchAlbums(q, limit);
    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
