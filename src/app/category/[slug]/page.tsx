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
  let currentCategoryInfo: { name: string; description: string | null } | null = null;

  try {
    const [currentCat, cats, catPosts, totalCount] = await Promise.all([
      prisma.category.findUnique({
        where: { slug },
        select: { name: true, description: true },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
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
          shortDescription: true,
          excerpt: true,
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
        take: 12,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ]);

    currentCategoryInfo = currentCat;
    categories = cats;
    totalPostCount = totalCount;

    // Sanitize and minimize payload per post card
    posts = catPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.shortDescription || (p.excerpt ? p.excerpt.slice(0, 140) + '...' : ''),
      coverImage: p.coverImage,
      createdAt: p.createdAt.toISOString(),
      categoryId: p.categoryId,
      category: p.category,
      author: p.author ? { username: p.author.username, image: p.author.image } : null,
    }));
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
        activeCategoryTitle={currentCategoryInfo?.name}
        activeCategoryDescription={currentCategoryInfo?.description}
      />
    </div>
  );
}
