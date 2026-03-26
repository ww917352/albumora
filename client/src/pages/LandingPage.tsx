import { useEffect } from 'react';
import { SearchBox } from '../components/search/SearchBox';
import { useTheme } from '../context/ThemeContext';

export function LandingPage() {
  const { resetPalette } = useTheme();

  useEffect(() => {
    resetPalette();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] relative overflow-hidden px-4">
      {/* Subtle ambient background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/2 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/1 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-3xl animate-fade-in">
        {/* Wordmark */}
        <div className="text-center">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tight select-none">
            albumora
          </h1>
          <p className="mt-3 text-white/40 text-base font-light tracking-wide">
            Explore music deeply
          </p>
        </div>

        {/* Search */}
        <div className="w-full flex justify-center">
          <SearchBox />
        </div>

        {/* Hint */}
        <p className="text-white/25 text-xs tracking-wide">
          Search by album title or artist name
        </p>
      </div>

      {/* Vinyl record decoration */}
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="98" stroke="white" strokeWidth="2" />
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="1" />
          <circle cx="100" cy="100" r="20" stroke="white" strokeWidth="1" />
          <circle cx="100" cy="100" r="8" stroke="white" strokeWidth="2" />
          <circle cx="100" cy="100" r="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}
