import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAlbum } from '../hooks/useAlbum';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import { AlbumHero } from '../components/album/AlbumHero';
import { TrackList } from '../components/album/TrackList';
import { LyricsDisplay } from '../components/album/LyricsDisplay';
import { WikiSection } from '../components/album/WikiSection';
import { Spinner } from '../components/ui/Spinner';
import type { Track } from '../types';

export function AlbumPage() {
  const { itunesId } = useParams<{ itunesId: string }>();
  const id = Number(itunesId);

  // Base loads fast (~400ms): iTunes metadata + palette. Renders the page immediately.
  const { data: albumBase, isLoading, error } = useQuery({
    queryKey: ['album-base', id],
    queryFn: () => api.albumBase(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });

  // Full data loads in background: adds lyrics, wikipedia, label.
  const { data: albumFull } = useAlbum(id);

  // Prefer full data once available, fall back to base
  const album = albumFull ?? albumBase;

  // True while the page is rendered from base data but full enrichment hasn't arrived
  const isEnriching = !!albumBase && !albumFull;

  const { applyPalette, resetPalette } = useTheme();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (album?.palette) applyPalette(album.palette);
    return () => resetPalette();
  }, [album?.palette]);

  // Reset selected track when album changes
  useEffect(() => {
    setSelectedTrack(null);
  }, [itunesId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-[var(--color-accent)]" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading album…</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[var(--color-text)] text-lg mb-2">Album not found</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Link to="/" className="text-[var(--color-accent)] text-sm hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Back nav */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Search
        </Link>
      </div>

      {/* Hero */}
      <AlbumHero album={album} isEnriching={isEnriching} />

      {/* Three-column content */}
      <div className="flex" style={{ backgroundColor: 'var(--color-bg)' }}>

        {/* Col 1 — Track listing (~1/4), sticky */}
        <div className="w-1/4 sticky top-0 h-screen overflow-y-auto border-r border-white/[0.06] px-6">
          <TrackList
            tracks={album.tracks}
            selectedPosition={selectedTrack?.position ?? null}
            onSelect={setSelectedTrack}
          />
        </div>

        {/* Col 2 — Lyrics (~1/4), sticky */}
        <div className="w-1/4 sticky top-0 h-screen overflow-y-auto border-r border-white/[0.06] px-6">
          <LyricsDisplay track={selectedTrack} isEnriching={isEnriching} />
        </div>

        {/* Col 3 — Wiki & more (~1/2), scrolls normally */}
        <div className="w-1/2 px-8 py-8 pb-24">
          {album.wikipedia ? (
            <WikiSection wiki={album.wikipedia} />
          ) : isEnriching ? (
            <WikiSkeleton />
          ) : null}
        </div>

      </div>
    </div>
  );
}

function WikiSkeleton() {
  return (
    <section className="py-8 border-t border-white/[0.08]">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
          About this Album
        </h2>
        <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--color-text-muted)] border-t-transparent animate-spin opacity-40" />
      </div>
      <div className="space-y-3 animate-pulse">
        {[100, 91, 96, 83, 100, 75, 88].map((w, i) => (
          <div key={i} className="h-3 bg-white/8 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </section>
  );
}
