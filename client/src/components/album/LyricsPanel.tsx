import { Disclosure } from '@headlessui/react';
import { ChevronDown, Music2 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  lyrics: string | null;
  trackTitle: string;
}

export function LyricsPanel({ lyrics, trackTitle }: Props) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={clsx(
              'flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors',
              'text-[var(--color-text-muted)] hover:text-[var(--color-accent)]',
              open && 'text-[var(--color-accent)]',
            )}
          >
            <Music2 className="h-3.5 w-3.5" />
            Lyrics
            <ChevronDown
              className={clsx(
                'h-3 w-3 transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="mt-3 mx-4 pb-4">
            {lyrics ? (
              <pre
                className="text-sm text-[var(--color-text-muted)] leading-7 whitespace-pre-wrap font-sans"
                aria-label={`Lyrics for ${trackTitle}`}
              >
                {lyrics}
              </pre>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] italic">
                Lyrics not available for this track.
              </p>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
