import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return {
    title: category ? `${category.name} Blogs | BlogFusion` : 'Category Not Found',
    description: `Explore the latest tips, tutorials, and guides in ${category?.name || 'this category'}.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch category and its posts
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="category-detail-page">
      <div className="container">
        <header className="category-header fade-in">
          <h1 className="text-center">{category.name}</h1>
          <p className="text-center">
            Discover {category.name} tips, tricks, and productivity hacks to streamline your workflow. 
            Learn advanced features and shortcuts to become a {category.name} power user.
          </p>
        </header>

        <div className="blog-list-container fade-in" style={{ animationDelay: '0.2s' }}>
          {category.posts.length > 0 ? (
            <div className="premium-blog-list">
              {category.posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="blog-list-item">
                  <span className="blog-number">{index + 1}.</span>
                  <span className="blog-title">{post.title}</span>
                  <span className="blog-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '6rem 0', opacity: 0.5 }}>
              <p style={{ fontSize: '1.2rem' }}>No blogs found in {category.name} yet.</p>
              <Link href="/category" className="btn btn-outline mt-4">Back to Topics</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
