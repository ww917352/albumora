import Vibrant from 'node-vibrant';
import { Palette } from '../types';

export async function extractPalette(imageUrl: string): Promise<Palette> {
  const fallback: Palette = {
    vibrant: '#8B6F47',
    darkVibrant: '#2C1810',
    muted: '#6B5B4E',
    darkMuted: '#1A1008',
    lightVibrant: '#D4A96A',
    lightMuted: '#C4B0A0',
  };

  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    return {
      vibrant: palette.Vibrant?.hex ?? fallback.vibrant,
      darkVibrant: palette.DarkVibrant?.hex ?? fallback.darkVibrant,
      muted: palette.Muted?.hex ?? fallback.muted,
      darkMuted: palette.DarkMuted?.hex ?? fallback.darkMuted,
      lightVibrant: palette.LightVibrant?.hex ?? fallback.lightVibrant,
      lightMuted: palette.LightMuted?.hex ?? fallback.lightMuted,
    };
  } catch {
    return fallback;
  }
}
