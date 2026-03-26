import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import type { Track } from '../../types';

interface Props {
  tracks: Track[];
  selectedPosition: number | null;
  onSelect: (track: Track) => void;
}

function formatMs(ms: number): string {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function TrackList({ tracks, selectedPosition, onSelect }: Props) {
  return (
    <section className="py-8">
      <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-medium mb-4">
        Tracks
      </h2>
      <div className="space-y-0.5">
        {tracks.map((track) => (
          <TrackRow
            key={track.position}
            track={track}
            selected={track.position === selectedPosition}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

function TrackRow({
  track,
  selected,
  onSelect,
}: {
  track: Track;
  selected: boolean;
  onSelect: (track: Track) => void;
}) {
  return (
    <div
      onClick={() => onSelect(track)}
      className={clsx(
        'group rounded-lg transition-colors duration-100 cursor-pointer',
        selected
          ? 'bg-[var(--color-accent)]/15 hover:bg-[var(--color-accent)]/20'
          : 'hover:bg-white/5',
      )}
    >
      <div className="flex items-center gap-3 px-2 py-2.5">
        {/* Track number */}
        <span
          className={clsx(
            'w-5 text-right text-xs flex-shrink-0 tabular-nums',
            selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]',
          )}
        >
          {track.position}
        </span>

        {/* Title */}
        <span
          className={clsx(
            'flex-1 text-sm truncate',
            selected ? 'font-semibold text-[var(--color-accent)]' : 'font-medium text-[var(--color-text)]',
          )}
        >
          {track.title}
        </span>

        {/* Duration */}
        {track.durationMs && (
          <span className="text-xs text-[var(--color-text-muted)] tabular-nums flex-shrink-0">
            {formatMs(track.durationMs)}
          </span>
        )}

        {/* Apple Music link */}
        {track.appleMusicUrl && (
          <a
            href={track.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent)] hover:text-[var(--color-accent-light)]"
            aria-label={`Play ${track.title} on Apple Music`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
