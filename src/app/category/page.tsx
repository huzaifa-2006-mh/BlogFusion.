import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';
import CategoryExplorer from '@/components/CategoryExplorer';

export const revalidate = 60; // ISR for instant mobile delivery

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/category', {
    title: 'Explore Categories & Articles | Blog Fusion',
    description: 'Browse articles, guides, and insights by topic on Blog Fusion.',
  });
}

export default async function CategoryIndexPage() {
  let categories: any[] = [];
  let posts: any[] = [];
  let totalPostCount = 0;

  try {
    const [cats, allPosts, count] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: { posts: { where: { published: true } } },
          },
        },
      }),
      prisma.post.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          shortDescription: true,
          coverImage: true,
          createdAt: true,
          categoryId: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ]);

    categories = cats;
    posts = allPosts;
    totalPostCount = count;
  } catch (error) {
    console.error('Failed to fetch categories or posts:', error);
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '80vh' }}>
      <CategoryExplorer
        categories={categories}
        posts={posts}
        initialCategorySlug="all"
        totalPostCount={totalPostCount}
      />
    </div>
  );
}
