function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractFirstImageSrc(html: string): string | null {
  const match = html?.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

export function stripImageFromHtml(html: string, imageUrl?: string | null): string {
  if (!html || !imageUrl) return html || '';

  const src = escapeRegExp(imageUrl);
  return html
    .replace(new RegExp(`<figure[^>]*>[\\s\\S]*?<img[^>]*src=["']${src}["'][^>]*>[\\s\\S]*?</figure>`, 'gi'), '')
    .replace(new RegExp(`<p[^>]*>\\s*<img[^>]*src=["']${src}["'][^>]*>\\s*</p>`, 'gi'), '')
    .replace(new RegExp(`<img[^>]*src=["']${src}["'][^>]*/?>`, 'gi'), '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
}
