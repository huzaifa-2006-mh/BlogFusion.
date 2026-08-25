import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import CategoryExplorer from '@/components/CategoryExplorer';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true }
    });
    return categories.map((cat) => ({
      slug: cat.slug
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({ where: { slug } });
    return {
      title: category ? `${category.name} - Blog Fusion` : 'Category - Blog Fusion',
      description: category?.description || `Explore the latest articles, guides, and insights in ${category?.name || 'this category'}.`,
    };
  } catch (error) {
    return {
      title: 'Categories - Blog Fusion',
      description: 'Explore topics on Blog Fusion',
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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
      <CategoryExplorer categories={categories} posts={posts} initialCategorySlug={slug} />
    </div>
  );
}
