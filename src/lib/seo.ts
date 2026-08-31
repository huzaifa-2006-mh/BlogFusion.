import { Metadata } from 'next';
import { unstable_noStore as noStore, revalidateTag } from 'next/cache';
import prisma from './prisma';

export const PAGE_SEO_TAG = 'page-seo';

export function normalizePagePath(pagePath: string): string {
  const trimmed = pagePath.trim();
  if (!trimmed || trimmed === '/') return '/';
  return trimmed.replace(/\/+$/, '') || '/';
}

export function revalidatePageSeo(pagePath: string) {
  const normalizedPath = normalizePagePath(pagePath);
  revalidateTag(PAGE_SEO_TAG);
  revalidateTag(`${PAGE_SEO_TAG}:${normalizedPath}`);
}

function resolveDefaultTitle(title: Metadata['title']): string | undefined {
  if (!title) return undefined;
  if (typeof title === 'string') return title;
  if (typeof title === 'object' && 'default' in title && title.default) {
    return String(title.default);
  }
  return undefined;
}

function resolveDefaultDescription(description: Metadata['description']): string | undefined {
  if (!description) return undefined;
  if (typeof description === 'string') return description;
  return undefined;
}

export async function getPageSeo(pagePath: string, defaultMetadata: Metadata): Promise<Metadata> {
  noStore();

  const normalizedPath = normalizePagePath(pagePath);

  try {
    const seoData = await prisma.pageSeo.findUnique({
      where: { pagePath: normalizedPath },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
    const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
    const defaultCanonical = `${cleanSiteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;

    if (!seoData) {
      return {
        ...defaultMetadata,
        alternates: {
          ...defaultMetadata.alternates,
          canonical: defaultMetadata.alternates?.canonical || defaultCanonical,
        },
        openGraph: {
          ...defaultMetadata.openGraph,
          url: defaultMetadata.openGraph?.url || defaultCanonical,
        },
      };
    }

    const defaultTitle = resolveDefaultTitle(defaultMetadata.title);
    const defaultDescription = resolveDefaultDescription(defaultMetadata.description);
    const title = seoData.metaTitle?.trim() || defaultTitle;
    const description = seoData.metaDescription?.trim() || defaultDescription;

    const canonical = seoData.canonicalUrl?.trim() || defaultCanonical;

    const metadata: Metadata = {
      title,
      description,
      keywords: seoData.focusKeywords?.trim() || undefined,
      openGraph: {
        title,
        description,
        images: seoData.ogImage?.trim() ? [{ url: seoData.ogImage.trim() }] : undefined,
        url: canonical,
        siteName: 'Blog Fusion',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoData.ogImage?.trim() ? [seoData.ogImage.trim()] : undefined,
      },
      alternates: {
        canonical: canonical,
      },
    };

    if (!seoData.isIndexable) {
      metadata.robots = {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      };
    } else {
      metadata.robots = {
        index: true,
        follow: true,
      };
    }

    return metadata;
  } catch (error) {
    console.error(`Error fetching SEO for ${normalizedPath}:`, error);
    return defaultMetadata;
  }
}
