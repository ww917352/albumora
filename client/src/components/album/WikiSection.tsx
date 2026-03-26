import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import type { WikiContent } from '../../types';

interface Props {
  wiki: WikiContent;
}

export function WikiSection({ wiki }: Props) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  const allOpen = openSections.size === wiki.sections.length;
  const allClosed = openSections.size === 0;

  function toggle(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function expandAll() {
    setOpenSections(new Set(wiki.sections.map((_, i) => i)));
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  return (
    <section className="py-8 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
          About this Album
        </h2>
        {wiki.sections.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <button
              onClick={expandAll}
              disabled={allOpen}
              className="hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              Expand all
            </button>
            <span className="opacity-30">·</span>
            <button
              onClick={collapseAll}
              disabled={allClosed}
              className="hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              Collapse all
            </button>
          </div>
        )}
      </div>

      {/* Intro */}
      {wiki.intro && (
        <div className="text-sm leading-7 text-[var(--color-text)] opacity-80 mb-6 space-y-4">
          {wiki.intro.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Expandable sections */}
      {wiki.sections.length > 0 && (
        <div className="space-y-1">
          {wiki.sections.map((section, i) => {
            const open = openSections.has(i);
            return (
              <div key={i} className="border border-white/[0.08] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3.5',
                    'text-sm font-medium text-[var(--color-text)] text-left',
                    'hover:bg-white/5 transition-colors',
                  )}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0 transition-transform duration-200',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1">
                    <div className="text-sm leading-7 text-[var(--color-text)] opacity-70 space-y-4">
                      {section.content.split('\n').filter(p => p.trim()).map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Wikipedia link */}
      {wiki.pageUrl && (
        <div className="mt-4">
          <a
            href={wiki.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Read more on Wikipedia
          </a>
        </div>
      )}
    </section>
  );
}
