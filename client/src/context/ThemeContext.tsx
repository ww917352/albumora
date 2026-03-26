import { createContext, useContext, useEffect, useRef } from 'react';
import type { Palette } from '../types';

interface ThemeContextValue {
  applyPalette: (palette: Palette) => void;
  resetPalette: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  applyPalette: () => {},
  resetPalette: () => {},
});

const DEFAULT_VARS = {
  '--color-bg': '#0f0e0d',
  '--color-surface': '#1a1816',
  '--color-accent': '#c8a04f',
  '--color-accent-light': '#f0d098',
  '--color-text': '#f5f0ea',
  '--color-text-muted': '#a09080',
};

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
}

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return (
    '#' +
    rgb
      .map((c) => Math.max(0, Math.round(c * (1 - amount))))
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const rootRef = useRef(document.documentElement);

  function applyPalette(palette: Palette) {
    const root = rootRef.current;

    const bg = palette.darkMuted || palette.darkVibrant || '#0f0e0d';
    const surface =
      darken(palette.muted || palette.darkVibrant || '#1a1816', 0.4) ||
      '#1a1816';
    const accent = palette.vibrant || palette.lightVibrant || '#c8a04f';
    const accentLight = palette.lightVibrant || palette.lightMuted || '#f0d098';

    const bgLum = luminance(bg);
    const textColor = bgLum > 128 ? '#1a1008' : '#f5f0ea';
    const textMuted = bgLum > 128 ? '#4a3828' : '#a09080';

    const vars: Record<string, string> = {
      '--color-bg': bg,
      '--color-surface': surface,
      '--color-accent': accent,
      '--color-accent-light': accentLight,
      '--color-text': textColor,
      '--color-text-muted': textMuted,
    };

    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function resetPalette() {
    const root = rootRef.current;
    Object.entries(DEFAULT_VARS).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  useEffect(() => {
    resetPalette();
  }, []);

  return (
    <ThemeContext.Provider value={{ applyPalette, resetPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
