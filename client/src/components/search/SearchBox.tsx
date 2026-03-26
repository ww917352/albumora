import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { useSearch } from '../../hooks/useSearch';
import { Spinner } from '../ui/Spinner';
import type { SearchResult } from '../../types';

export function SearchBox() {
  const { query, setQuery, results, loading } = useSearch();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(results.length > 0 && query.trim().length > 0);
    setHighlighted(-1);
  }, [results, query]);

  function select(item: SearchResult) {
    setQuery('');
    setOpen(false);
    navigate(`/album/${item.itunesId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      select(results[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Input */}
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 h-5 w-5 text-white/40 pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search for an album or artist…"
          className={clsx(
            'w-full bg-white/10 backdrop-blur-md border border-white/20',
            'rounded-2xl pl-12 pr-12 py-4 text-white text-lg',
            'placeholder:text-white/40 outline-none',
            'transition-all duration-200',
            'focus:bg-white/[0.12] focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]',
          )}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && (
          <Spinner className="absolute right-4 text-white/40" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={clsx(
            'absolute top-full left-0 right-0 mt-2 z-50',
            'bg-zinc-900/95 backdrop-blur-xl border border-white/10',
            'rounded-2xl overflow-hidden shadow-2xl',
            'animate-slide-up',
          )}
        >
          {results.map((item, i) => (
            <button
              key={item.itunesId}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 text-left',
                'transition-colors duration-100',
                i === highlighted ? 'bg-white/10' : 'hover:bg-white/6',
                i !== results.length - 1 && 'border-b border-white/6',
              )}
              onMouseDown={() => select(item)}
              onMouseEnter={() => setHighlighted(i)}
            >
              <img
                src={item.artworkUrl}
                alt=""
                className="h-11 w-11 rounded-md object-cover flex-shrink-0 bg-white/10"
              />
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {item.title}
                </p>
                <p className="text-white/50 text-xs truncate">
                  {item.artist}
                  {item.year ? ` · ${item.year}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
