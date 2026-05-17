import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return {
    title: category ? `${category.name} - Digital Inspiration` : 'Category Not Found',
    description: category?.description || `Explore the latest tips, tutorials, and guides in ${category?.name || 'this category'}.`,
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
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const posts = category.posts;

  return (
    <div className="category-detail-page" style={{ padding: '6rem 0 8rem 0', background: 'transparent' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Sleek Centered Header */}
        <header className="category-header fade-in" style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: '900', 
            marginBottom: '0.6rem', 
            color: '#0f172a',
            letterSpacing: '-0.04em',
            lineHeight: '1.05'
          }}>
            {category.name}
          </h1>
          <p style={{ 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: '#475569', 
            fontSize: '1.3rem', 
            fontWeight: '500', 
            lineHeight: '1.5',
            letterSpacing: '-0.01em'
          }}>
            {category.description || `Tips and tutorials for ${category.name}`}
          </p>
        </header>

        {/* Elegant Numbered Posts List */}
        <div className="fade-in" style={{ animationDelay: '0.15s' }}>
          {posts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {posts.map((post, idx) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '1.4rem 0', 
                    borderBottom: '1px solid #f1f5f9', 
                    textDecoration: 'none', 
                    transition: 'all 0.25s ease' 
                  }}
                  className="category-post-row"
                >
                  {/* Left Side: Number + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flex: '1', paddingRight: '2rem' }}>
                    <span style={{ 
                      color: '#ec4899', // Premium pink/rose color matching the screenshot
                      fontWeight: '800', 
                      fontSize: '1.15rem',
                      minWidth: '2rem',
                      fontFamily: 'var(--font-heading), sans-serif'
                    }}>
                      {idx + 1}.
                    </span>
                    <span className="category-post-title" style={{ 
                      color: '#0f172a', 
                      fontSize: '1.15rem', 
                      fontWeight: '600', 
                      lineHeight: '1.4',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease'
                    }}>
                      {post.title}
                    </span>
                  </div>
                  
                  {/* Right Side: Date */}
                  <span style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.95rem', 
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                    letterSpacing: '-0.02em'
                  }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '6rem 0', opacity: 0.5 }}>
              <p style={{ fontSize: '1.2rem', color: '#64748b' }}>No blogs found in {category.name} yet.</p>
              <Link href="/" className="btn btn-outline mt-4">Back to Home</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
