import type { Album } from '../../types';
import { PurchaseLinks } from './PurchaseLinks';

interface Props {
  album: Album;
  isEnriching?: boolean;
}

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
}

function totalDuration(tracks: Album['tracks']): string | null {
  const total = tracks.reduce((acc, t) => acc + (t.durationMs || 0), 0);
  if (!total) return null;
  return formatDuration(total);
}

export function AlbumHero({ album, isEnriching }: Props) {
  const duration = totalDuration(album.tracks);

  return (
    <div className="relative min-h-[55vh] flex items-end overflow-hidden">
      {/* Full-bleed artwork background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${album.artworkUrl})` }}
      />

      {/* Vignette: darken edges + fade right to bg color */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-[var(--color-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-8 pb-10 pt-24 flex items-end gap-8">
        {/* Album art (small, crisp) */}
        <img
          src={album.artworkUrl}
          alt={album.title}
          className="hidden md:block h-48 w-48 lg:h-56 lg:w-56 rounded-xl shadow-2xl flex-shrink-0 object-cover"
        />

        {/* Meta */}
        <div className="min-w-0 flex-1 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-2">
            Album
          </p>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
            {album.title}
          </h1>
          <p className="text-xl text-white/80 font-light mb-4">{album.artist}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
            {album.releaseYear && <span>{album.releaseYear}</span>}
            {album.label ? (
              <>
                <span className="text-white/25">·</span>
                <span>{album.label}</span>
              </>
            ) : isEnriching ? (
              <>
                <span className="text-white/25">·</span>
                <span className="inline-block h-3 w-20 bg-white/15 rounded animate-pulse" />
              </>
            ) : null}
            {album.genre && (
              <>
                <span className="text-white/25">·</span>
                <span>{album.genre}</span>
              </>
            )}
            {album.totalTracks > 0 && (
              <>
                <span className="text-white/25">·</span>
                <span>{album.totalTracks} tracks</span>
              </>
            )}
            {duration && (
              <>
                <span className="text-white/25">·</span>
                <span>{duration}</span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {album.appleMusicUrl && (
              <a
                href={album.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                           bg-[var(--color-accent)] text-black hover:opacity-90 transition-opacity"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a6.303 6.303 0 00-1.903-.737 10.15 10.15 0 00-1.773-.217c-.12-.007-.364-.012-.615-.012H6.72c-.252 0-.496.005-.616.012a10.15 10.15 0 00-1.773.217 6.303 6.303 0 00-1.902.737C1.31 1.624.565 2.624.248 3.934a9.23 9.23 0 00-.24 2.19C.004 6.253 0 6.505 0 6.756v10.488c0 .252.004.504.008.633a9.23 9.23 0 00.24 2.19c.317 1.31 1.062 2.31 2.18 3.043a6.303 6.303 0 001.902.737c.58.117 1.175.192 1.773.217.12.007.364.012.615.012h10.564c.252 0 .496-.005.615-.012a10.15 10.15 0 001.773-.217 6.303 6.303 0 001.902-.737c1.118-.733 1.863-1.733 2.18-3.043a9.23 9.23 0 00.24-2.19c.004-.13.008-.381.008-.633V6.756c0-.251-.004-.503-.008-.632zm-6.965 5.888l-3.552 2.05c-.412.238-.86.357-1.31.357-.45 0-.897-.12-1.31-.357l-3.552-2.05a2.62 2.62 0 01-1.31-2.274V7.364c0-.937.5-1.806 1.31-2.274l3.552-2.05a2.62 2.62 0 012.62 0l3.552 2.05a2.62 2.62 0 011.31 2.274v2.374a2.62 2.62 0 01-1.31 2.274z" />
                </svg>
                Listen on Apple Music
              </a>
            )}
            <PurchaseLinks links={album.purchaseLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}
