import { Music2 } from 'lucide-react';
import type { Track } from '../../types';

interface Props {
  track: Track | null;
}

export function LyricsDisplay({ track }: Props) {
  if (!track) {
    return (
      <div className="py-8 flex flex-col items-center justify-center h-full text-center px-6">
        <Music2 className="h-8 w-8 text-[var(--color-text-muted)] opacity-30 mb-3" />
        <p className="text-sm text-[var(--color-text-muted)] opacity-50">
          Select a track to view lyrics
        </p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-medium mb-1">
        Lyrics
      </h2>
      <p className="text-sm font-semibold text-[var(--color-accent)] mb-5">
        {track.title}
      </p>

      {track.lyrics ? (
        <pre className="text-sm text-[var(--color-text)] opacity-75 leading-7 whitespace-pre-wrap font-sans">
          {track.lyrics}
        </pre>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)] italic">
          Lyrics not available for this track.
        </p>
      )}
    </section>
  );
}
