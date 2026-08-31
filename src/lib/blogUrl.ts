function withProtocol(url: string): string {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://blog-fusion-beta.vercel.app';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

const SITE_URL = withProtocol(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app');

export function getSiteUrl() {
  return SITE_URL;
}

export function slugify(input: string): string {
  return slugifyTyping(input).replace(/^-+|-+$/g, '');
}

/** Live slug cleaning that keeps a trailing hyphen while the user is still typing. */
export function slugifyTyping(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

export function toBlogSlugInput(input: string): string {
  const val = (input || '').trim();
  if (!val) return '';

  const isCompleteUrl =
    /^https?:\/\/\S+\.\S+/i.test(val) ||
    /^www\.\S+\.\S+/i.test(val) ||
    /\/blog\/[a-z0-9-]+\/?$/i.test(val);

  if (isCompleteUrl) {
    return extractBlogSlug(val);
  }

  return slugifyTyping(val);
}

export function isCanonicalOk(input: string | null | undefined, slug: string): boolean {
  const fallback = slug ? defaultPostCanonical(slugify(slug) || slug) : defaultPostCanonical('post');
  const resolved = normalizeCanonicalUrl(input, fallback);
  try {
    const parsed = new URL(resolved);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return /^https?:\/\/[^\s]+/i.test(resolved);
  }
}

/** Accepts a slug, path, or full URL and returns a clean blog slug. */
export function extractBlogSlug(input: string): string {
  let val = (input || '').trim();
  if (!val) return '';

  try {
    const hasProtocol = /^https?:\/\//i.test(val);
    const looksLikeUrl = hasProtocol || val.startsWith('www.') || val.includes('://');
    if (looksLikeUrl) {
      const url = new URL(hasProtocol ? val : val.startsWith('www.') ? `https://${val}` : val);
      val = url.pathname;
    }
  } catch {
    // keep raw value
  }

  val = val.replace(/^\/+/, '');
  if (val.toLowerCase().startsWith('blog/')) {
    val = val.slice(5);
  }
  val = val.split(/[/?#]/).filter(Boolean).pop() || val;
  return slugify(val);
}

export function normalizeCanonicalUrl(input: string | null | undefined, fallback: string): string {
  let raw = (input || '').trim();
  raw = raw.replace(/^['"<]+|['">]+$/g, '').trim();

  const safeFallback = withProtocol(fallback || defaultPostCanonical('post')).replace(/\/+$/, '');

  if (!raw) return safeFallback;

  if (raw.startsWith('/')) {
    return `${SITE_URL}${raw}`.replace(/\/+$/, '') || safeFallback;
  }

  if (!/^https?:\/\//i.test(raw)) {
    if (raw.startsWith('www.')) {
      return `https://${raw}`.replace(/\/+$/, '');
    }
    if (!raw.includes('.')) {
      return `${SITE_URL}/blog/${slugify(raw)}`.replace(/\/+$/, '') || safeFallback;
    }
    return `https://${raw}`.replace(/\/+$/, '');
  }

  return raw.replace(/\/+$/, '') || safeFallback;
}

export function defaultPostCanonical(slug: string): string {
  const clean = slugify(slug) || slug || 'post';
  return `${SITE_URL}/blog/${clean}`;
}
