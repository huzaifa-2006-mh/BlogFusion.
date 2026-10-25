/**
 * Optimizes image URLs, specifically targeting Unsplash and remote URLs
 * to ensure responsive sizes, format conversion (WebP/AVIF), and high compression.
 */

export function optimizeImageUrl(
  url: string | null | undefined,
  width = 600,
  quality = 75
): string {
  if (!url) return '';

  // Optimize Unsplash images
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('q', quality.toString());
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Returns srcSet for Unsplash images
 */
export function getResponsiveImageSrcSet(
  url: string | null | undefined,
  widths: number[] = [360, 600, 900]
): string | undefined {
  if (!url || !url.includes('images.unsplash.com')) return undefined;

  return widths
    .map((w) => `${optimizeImageUrl(url, w)} ${w}w`)
    .join(', ');
}
