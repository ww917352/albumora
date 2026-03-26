import axios from 'axios';
import { WikiContent, WikiSection } from '../types';

const WP_API = 'https://en.wikipedia.org/w/api.php';
const USER_AGENT = 'albumora/1.0 (https://github.com/albumora; contact@albumora.app) axios';

async function fetchExtract(title: string): Promise<{ extract: string; pageUrl: string | null } | null> {
  try {
    const res = await axios.get(WP_API, {
      params: {
        action: 'query',
        titles: title,
        prop: 'extracts|info',
        explaintext: '1',
        exsectionformat: 'wiki',
        inprop: 'url',
        redirects: '1',
        format: 'json',
        formatversion: '2',
      },
      timeout: 8000,
      headers: { 'User-Agent': USER_AGENT },
    });

    const page = res.data?.query?.pages?.[0];
    if (!page || page.missing || !page.extract) return null;
    // Discard disambiguation pages
    if (page.extract.startsWith('may refer to') || page.title?.includes('(disambiguation)')) return null;

    return {
      extract: page.extract as string,
      pageUrl: page.canonicalurl ?? page.fullurl ?? null,
    };
  } catch {
    return null;
  }
}

function parseExtract(extract: string): { intro: string; sections: WikiSection[] } {
  // Split on section headers: lines that start and end with ==
  const sectionRegex = /^(={2,3})\s*(.+?)\s*\1$/m;
  const parts = extract.split(/^(={2,3}\s*.+?\s*={2,3})$/m);

  // parts[0] is the intro, then alternating [header, content, header, content, ...]
  const intro = parts[0].trim();
  const sections: WikiSection[] = [];

  for (let i = 1; i < parts.length - 1; i += 2) {
    const header = parts[i];
    const content = (parts[i + 1] || '').trim();

    const match = header.match(/^(={2,3})\s*(.+?)\s*\1$/);
    if (!match || !content) continue;

    const level = match[1].length - 1; // == -> 1, === -> 2

    // Skip boilerplate sections
    const title = match[2].trim();
    const skipSections = ['track listing', 'personnel', 'charts', 'certifications', 'see also', 'references', 'bibliography', 'external links', 'release history'];
    if (skipSections.some((s) => title.toLowerCase().includes(s))) continue;

    sections.push({ title, content, level });
  }

  return { intro, sections };
}

export async function getAlbumWikipedia(
  title: string,
  artist: string,
): Promise<WikiContent | null> {
  const candidates = [
    `${title} (album)`,
    `${title} (${artist} album)`,
    title,
  ];

  for (const candidate of candidates) {
    const result = await fetchExtract(candidate);
    if (!result) continue;

    const { intro, sections } = parseExtract(result.extract);
    if (!intro && sections.length === 0) continue;

    return { intro, sections, pageUrl: result.pageUrl };
  }

  return null;
}
