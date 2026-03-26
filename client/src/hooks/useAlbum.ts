import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAlbum(itunesId: number | null) {
  return useQuery({
    queryKey: ['album', itunesId],
    queryFn: () => api.album(itunesId!),
    enabled: itunesId !== null,
    staleTime: 1000 * 60 * 30,
  });
}
