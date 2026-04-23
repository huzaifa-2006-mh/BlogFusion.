import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

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
    <div>
      <section className="hero" style={{ padding: '6rem 0 3rem' }}>
        <div className="container">
          <span className="card-category" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Category</span>
          <h1>{category.name}</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>Explore the latest insights and tutorials in {category.name}.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Latest in {category.name}</h2>
          </div>
          
          {category.posts.length > 0 ? (
            <div className="card-grid">
              {category.posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.coverImage ? (
                    <div className="card-img">
                      <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', color: '#888' }}>
                      No Image
                    </div>
                  )}
                  <div className="card-body">
                    <span className="card-category">{category.name}</span>
                    <h3 className="card-title">{post.title}</h3>
                    <p style={{ fontSize: '0.95rem' }}>{post.excerpt}</p>
                    <span className="highlight" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Read Full Story &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '4rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.2rem', color: '#888' }}>No blogs found in this category yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
