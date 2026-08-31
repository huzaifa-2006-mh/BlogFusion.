function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function srcVariants(imageUrl: string): string[] {
  const variants = new Set<string>();
  const raw = (imageUrl || '').trim();
  if (!raw) return [];

  variants.add(raw);
  variants.add(raw.replace(/&amp;/g, '&'));
  try {
    variants.add(decodeURIComponent(raw));
  } catch {
    /* ignore */
  }

  try {
    const pathOnly = raw.startsWith('http') ? new URL(raw).pathname : raw.split('?')[0];
    if (pathOnly) {
      variants.add(pathOnly);
      const fileName = pathOnly.split('/').filter(Boolean).pop();
      if (fileName) variants.add(fileName);
    }
  } catch {
    const fileName = raw.split('/').filter(Boolean).pop();
    if (fileName) variants.add(fileName);
  }

  return [...variants].filter(Boolean);
}

export function extractFirstImageSrc(html: string): string | null {
  const match = html?.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

export function extractLastImageSrc(html: string): string | null {
  const matches = html?.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (!matches?.length) return null;
  const last = matches[matches.length - 1].match(/src=["']([^"']+)["']/i);
  return last?.[1] || null;
}

export function stripImageFromHtml(html: string, imageUrl?: string | null): string {
  if (!html || !imageUrl) return html || '';

  let next = html;
  for (const variant of srcVariants(imageUrl)) {
    const src = escapeRegExp(variant);
    next = next
      .replace(new RegExp(`<figure[^>]*>[\\s\\S]*?<img[^>]*src=["'][^"']*${src}[^"']*["'][^>]*>[\\s\\S]*?</figure>`, 'gi'), '')
      .replace(new RegExp(`<p[^>]*>\\s*<img[^>]*src=["'][^"']*${src}[^"']*["'][^>]*>\\s*</p>`, 'gi'), '')
      .replace(new RegExp(`<img[^>]*src=["'][^"']*${src}[^"']*["'][^>]*/?>`, 'gi'), '');
  }

  return next.replace(/<p>\s*<\/p>/gi, '').replace(/<figure>\s*<\/figure>/gi, '').trim();
}

export function stripTrailingImage(html: string): string {
  if (!html) return '';
  return html
    .replace(/(<figure[^>]*>[\s\S]*?<img\b[\s\S]*?>[\s\S]*?<\/figure>)\s*$/i, '')
    .replace(/(<p[^>]*>\s*<img\b[\s\S]*?>\s*<\/p>)\s*$/i, '')
    .replace(/(<img\b[\s\S]*?>)\s*$/i, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
}

/** Cover belongs at the top of the post, never as a leftover image under the article. */
export function stripCoverFromContent(html: string, coverUrl?: string | null): string {
  let next = html || '';
  if (coverUrl) {
    next = stripImageFromHtml(next, coverUrl);
  }

  const lastSrc = extractLastImageSrc(next);
  if (coverUrl && lastSrc) {
    const coverBits = srcVariants(coverUrl);
    const lastBits = srcVariants(lastSrc);
    const isSame = coverBits.some((bit) => lastBits.includes(bit));
    const imageCount = (next.match(/<img\b/gi) || []).length;
    if (isSame || imageCount === 1) {
      next = stripTrailingImage(next);
    }
  }

  return next;
}
