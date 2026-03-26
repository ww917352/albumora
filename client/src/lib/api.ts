const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  search: (q: string) =>
    get<{ results: import('../types').SearchResult[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
  albumBase: (itunesId: number) => get<import('../types').Album>(`/album/${itunesId}/base`),
  album: (itunesId: number) => get<import('../types').Album>(`/album/${itunesId}`),
};
