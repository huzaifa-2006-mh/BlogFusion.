const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app').replace(/\/+$/, '');

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
  if (/https?:\/\//i.test(val) || val.includes('://') || /^www\./i.test(val) || /\/blog\//i.test(val)) {
    return extractBlogSlug(val);
  }
  return slugifyTyping(val);
}

export function isCanonicalOk(input: string | null | undefined, slug: string): boolean {
  const resolved = normalizeCanonicalUrl(input, slug ? defaultPostCanonical(slug) : '');
  return /^https?:\/\/\S+/i.test(resolved);
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
  if (!raw) return fallback.replace(/\/+$/, '');

  if (raw.startsWith('/')) {
    return `${SITE_URL}${raw}`.replace(/\/+$/, '') || fallback;
  }

  if (!/^https?:\/\//i.test(raw)) {
    if (raw.startsWith('www.')) {
      return `https://${raw}`.replace(/\/+$/, '');
    }
    if (!raw.includes('.')) {
      return `${SITE_URL}/blog/${slugify(raw)}`;
    }
    return `https://${raw}`.replace(/\/+$/, '');
  }

  return raw.replace(/\/+$/, '') || fallback;
}

export function defaultPostCanonical(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

