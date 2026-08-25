import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';
import CategoryExplorer from '@/components/CategoryExplorer';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/category', {
    title: 'Explore Categories & Articles | Blog Fusion',
    description: 'Browse articles, guides, and insights by topic on Blog Fusion.',
  });
}

export default async function CategoryIndexPage() {
  let categories: any[] = [];
  let posts: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        category: true,
        author: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch categories or posts:', error);
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '80vh' }}>
      <CategoryExplorer categories={categories} posts={posts} initialCategorySlug="all" />
    </div>
  );
}
