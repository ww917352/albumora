import { Router, Request, Response } from 'express';
import { LRUCache } from 'lru-cache';
import { aggregateAlbum } from '../aggregator/albumAggregator';
import { Album } from '../types';

const router = Router();

const cache = new LRUCache<number, Album>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
});

router.get('/:itunesId', async (req: Request, res: Response) => {
  const itunesId = Number(req.params.itunesId);
  if (!itunesId || isNaN(itunesId)) {
    res.status(400).json({ error: 'Invalid iTunes ID' });
    return;
  }

  const cached = cache.get(itunesId);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const album = await aggregateAlbum(itunesId);
    cache.set(itunesId, album);
    res.json(album);
  } catch (err) {
    console.error('Album aggregation error:', err);
    res.status(500).json({ error: 'Failed to load album' });
  }
});

export default router;
