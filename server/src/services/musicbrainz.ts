import axios from 'axios';

const MB_BASE = 'https://musicbrainz.org/ws/2';
const USER_AGENT = 'albumora/1.0 (contact@albumora.app)';

// MusicBrainz enforces 1 req/sec — we serialize requests with a simple queue
let lastRequestTime = 0;
async function throttle() {
  const now = Date.now();
  const gap = 1100 - (now - lastRequestTime);
  if (gap > 0) await new Promise((r) => setTimeout(r, gap));
  lastRequestTime = Date.now();
}

async function mbGet(path: string, params: Record<string, string | number>) {
  await throttle();
  const res = await axios.get(`${MB_BASE}${path}`, {
    params: { ...params, fmt: 'json' },
    headers: { 'User-Agent': USER_AGENT },
    timeout: 8000,
  });
  return res.data;
}

export async function getReleaseInfo(
  title: string,
  artist: string,
): Promise<{ label: string | null; releaseDate: string | null } | null> {
  try {
    // Try "{title} (album)" first for disambiguation
    const queries = [
      `release:"${title}" AND artist:"${artist}" AND primarytype:Album`,
      `release:"${title}" AND artist:"${artist}"`,
    ];

    for (const q of queries) {
      const data = await mbGet('/release', { query: q, limit: 5 });
      const releases: any[] = data.releases || [];
      const best = releases.find((r) => r.score >= 85);
      if (!best) continue;

      // Fetch full release to get label
      const full = await mbGet(`/release/${best.id}`, {
        inc: 'labels+release-groups',
      });

      const labelInfo = full['label-info']?.[0];
      const label = labelInfo?.label?.name || null;
      const date = full.date || null;

      return { label, releaseDate: date };
    }

    return null;
  } catch {
    return null;
  }
}
