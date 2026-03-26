import { Music2 } from 'lucide-react';
import type { Track } from '../../types';

interface Props {
  track: Track | null;
  isEnriching?: boolean;
}

export function LyricsDisplay({ track, isEnriching }: Props) {
  if (!track) {
    return (
      <div className="pt-16 flex flex-col items-center text-center px-6">
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
      ) : isEnriching ? (
        <div className="space-y-2.5 animate-pulse mt-2">
          {[100, 85, 100, 70, 100, 90, 100, 60].map((w, i) => (
            <div key={i} className="h-3 bg-white/10 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)] italic">
          Lyrics not available for this track.
        </p>
      )}
    </section>
  );
}
