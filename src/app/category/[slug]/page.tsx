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
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  // Split posts into blocks of 5 (1 featured + 1 regular left, 3 regular right)
  const posts = category.posts;
  const blocks: any[][] = [];
  for (let i = 0; i < posts.length; i += 5) {
    blocks.push(posts.slice(i, i + 5));
  }

  return (
    <div className="category-detail-page" style={{ padding: '3rem 0' }}>
      <div className="container">
        <header className="category-header fade-in" style={{ marginBottom: '4rem' }}>
          <h1 className="text-center" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>{category.name}</h1>
          <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto', color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Discover {category.name} tips, tricks, and productivity hacks to streamline your workflow. 
            Learn advanced features and shortcuts to become a {category.name} power user.
          </p>
        </header>

        <div className="blog-list-container fade-in" style={{ animationDelay: '0.2s' }}>
          {blocks.length > 0 ? (
            blocks.map((block, blockIdx) => (
              <div key={blockIdx} className="blog-layout" style={{ marginBottom: '3rem' }}>
                {/* Left Column: Featured + Post 3 */}
                <div className="featured-column" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {/* Featured Post (Large Left) */}
                  {block[0] && (
                    <div className="featured-post">
                      <Link href={`/blog/${block[0].slug}`}>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '0.4rem 1.2rem', 
                          border: '2px solid black', 
                          fontWeight: '800', 
                          textTransform: 'uppercase', 
                          fontSize: '0.75rem',
                          marginBottom: '1.5rem',
                          boxShadow: '4px 4px 0px rgba(0,0,0,1)'
                        }}>
                          {block[0].category.name} &rarr;
                        </span>
                        <h2 style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem', fontWeight: '800' }}>
                          {block[0].title}
                        </h2>
                        {block[0].shortDescription && (
                          <p style={{ fontSize: '1.2rem', color: '#334155', fontWeight: '600', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                              {block[0].shortDescription}
                          </p>
                        )}
                      </Link>
                      <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.6' }}>{block[0].excerpt}</p>
                      {block[0].coverImage && (
                        <img src={block[0].coverImage} alt={block[0].title} style={{ width: '100%', borderRadius: '4px', marginTop: '2rem' }} />
                      )}
                    </div>
                  )}

                  {/* Secondary Post 3 (rendered inside left column to balance height) */}
                  {block[3] && (
                    <article key={block[3].id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <Link href={`/blog/${block[3].slug}`}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                          {block[3].title}
                        </h3>
                        {block[3].shortDescription && (
                            <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {block[3].shortDescription}
                            </p>
                        )}
                      </Link>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>{block[3].excerpt}</p>
                    </article>
                  )}
                </div>

                {/* Secondary Posts (List Right) */}
                <div className="secondary-list">
                  {[block[1], block[2], block[4]].filter(Boolean).map((post) => (
                    <article key={post.id} style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                          {post.title}
                        </h3>
                        {post.shortDescription && (
                            <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {post.shortDescription}
                            </p>
                        )}
                      </Link>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>{post.excerpt}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center" style={{ padding: '6rem 0', opacity: 0.5 }}>
              <p style={{ fontSize: '1.2rem' }}>No blogs found in {category.name} yet.</p>
              <Link href="/" className="btn btn-outline mt-4">Back to Home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
