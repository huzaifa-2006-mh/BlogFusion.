import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('pagePath');

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    const seoData = await prisma.pageSeo.findUnique({
      where: { pagePath },
    });

    return NextResponse.json({ seo: seoData || null });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { pagePath, metaTitle, metaDescription, focusKeywords, ogImage, canonicalUrl, isIndexable } = data;

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    const seoData = await prisma.pageSeo.upsert({
      where: { pagePath },
      update: {
        metaTitle,
        metaDescription,
        focusKeywords,
        ogImage,
        canonicalUrl,
        isIndexable: isIndexable ?? true,
      },
      create: {
        pagePath,
        metaTitle,
        metaDescription,
        focusKeywords,
        ogImage,
        canonicalUrl,
        isIndexable: isIndexable ?? true,
      },
    });

    return NextResponse.json({ success: true, seo: seoData });
  } catch (error) {
    console.error('Error updating SEO data:', error);
    return NextResponse.json({ error: 'Failed to update SEO data' }, { status: 500 });
  }
}
