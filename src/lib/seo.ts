import { Metadata } from 'next';
import prisma from './prisma';

export function normalizePagePath(pagePath: string): string {
  const trimmed = pagePath.trim();
  if (!trimmed || trimmed === '/') return '/';
  return trimmed.replace(/\/+$/, '') || '/';
}

export async function getPageSeo(pagePath: string, defaultMetadata: Metadata): Promise<Metadata> {
  const normalizedPath = normalizePagePath(pagePath);

  try {
    const seoData = await prisma.pageSeo.findUnique({
      where: { pagePath: normalizedPath },
    });

    if (!seoData) return defaultMetadata;

    const metadata: Metadata = {
      ...defaultMetadata,
      title: seoData.metaTitle || defaultMetadata.title,
      description: seoData.metaDescription || defaultMetadata.description,
      keywords: seoData.focusKeywords || (defaultMetadata.keywords as string | undefined),
      openGraph: {
        ...(defaultMetadata.openGraph || {}),
        title: seoData.metaTitle || (defaultMetadata.openGraph as any)?.title,
        description: seoData.metaDescription || (defaultMetadata.openGraph as any)?.description,
        images: seoData.ogImage ? [{ url: seoData.ogImage }] : (defaultMetadata.openGraph as any)?.images,
        url: seoData.canonicalUrl || (defaultMetadata.openGraph as any)?.url,
      },
      alternates: {
        canonical: seoData.canonicalUrl || undefined,
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
    }

    return metadata;
  } catch (error) {
    console.error(`Error fetching SEO for ${normalizedPath}:`, error);
    return defaultMetadata;
  }
}
