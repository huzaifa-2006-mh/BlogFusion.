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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({ where: { slug } });
    const canonical = `${cleanSiteUrl}/category/${slug}`;
    return {
      title: category ? `${category.name} - Blog Fusion` : 'Category - Blog Fusion',
      description: category?.description || `Explore the latest articles, guides, and insights in ${category?.name || 'this category'}.`,
      alternates: {
        canonical,
      },
      openGraph: {
        title: category ? `${category.name} - Blog Fusion` : 'Category - Blog Fusion',
        description: category?.description || `Explore the latest articles, guides, and insights in ${category?.name || 'this category'}.`,
        url: canonical,
      },
    };
  } catch (error) {
    return {
      title: 'Categories - Blog Fusion',
      description: 'Explore topics on Blog Fusion',
      alternates: {
        canonical: `${cleanSiteUrl}/category`,
      },
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
