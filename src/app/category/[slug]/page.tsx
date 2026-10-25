import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import CategoryExplorer from '@/components/CategoryExplorer';

export const revalidate = 60; // ISR for instant mobile delivery

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true }
    });
    return categories.map((cat) => ({
      slug: cat.slug
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
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
  } catch {
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
  let totalPostCount = 0;

  try {
    const [cats, catPosts, totalCount] = await Promise.all([
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
        where: {
          published: true,
          category: { slug },
        },
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
    posts = catPosts;
    totalPostCount = totalCount;
  } catch (error) {
    console.error('Failed to fetch category posts:', error);
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '80vh' }}>
      <CategoryExplorer
        categories={categories}
        posts={posts}
        initialCategorySlug={slug}
        totalPostCount={totalPostCount}
      />
    </div>
  );
}
