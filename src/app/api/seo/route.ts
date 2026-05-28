import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { normalizePagePath } from '@/lib/seo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('pagePath');

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    const normalizedPath = normalizePagePath(pagePath);

    const seoData = await prisma.pageSeo.findUnique({
      where: { pagePath: normalizedPath },
    });

    return NextResponse.json({ seo: seoData || null });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('auth_session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { pagePath, metaTitle, metaDescription, focusKeywords, ogImage, canonicalUrl, isIndexable } = data;

    if (!pagePath) {
      return NextResponse.json({ error: 'Page path is required' }, { status: 400 });
    }

    const normalizedPath = normalizePagePath(pagePath);

    const seoData = await prisma.pageSeo.upsert({
      where: { pagePath: normalizedPath },
      update: {
        metaTitle,
        metaDescription,
        focusKeywords,
        ogImage,
        canonicalUrl,
        isIndexable: isIndexable ?? true,
      },
      create: {
        pagePath: normalizedPath,
        metaTitle,
        metaDescription,
        focusKeywords,
        ogImage,
        canonicalUrl,
        isIndexable: isIndexable ?? true,
      },
    });

    revalidatePath(normalizedPath, 'layout');
    revalidatePath(normalizedPath, 'page');

    return NextResponse.json({ success: true, seo: seoData });
  } catch (error) {
    console.error('Error updating SEO data:', error);
    return NextResponse.json({ error: 'Failed to update SEO data' }, { status: 500 });
  }
}
