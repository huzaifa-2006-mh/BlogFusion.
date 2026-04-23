import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function Home() {
  let posts: any[] = []; // Explicitly typed to allow build
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      take: 6,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container fade-in">
          <h1>Best Platform for Tech, Online Earning, Jobs & Entertainment Blogs</h1>
          <p>
            Welcome to <strong>BlogFusion</strong>, a complete multi-niche blog where you can explore the latest updates in technology, programming tutorials, online earning methods, job opportunities, anime reviews, and entertainment content.
          </p>
          <div className="mt-4">
            <Link href="/category/online-earning" className="btn btn-primary" style={{ marginRight: '1rem' }}>
              Explore Earning Methods
            </Link>
            <Link href="/category/technology" className="btn btn-outline">
              Tech Updates
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Blogs Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>🌐 Latest From Our Authors</h2>
          </div>
          
          {posts.length > 0 ? (
            <div className="card-grid">
              {posts.map((post) => (
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
                    <span className="card-category">{post.category.name}</span>
                    <h3 className="card-title">{post.title}</h3>
                    <p style={{ fontSize: '0.95rem' }}>{post.excerpt}</p>
                    <span className="highlight" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Read Full Story &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '4rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.2rem', color: '#888' }}>No blogs published yet. Be the first to share your knowledge!</p>
              <Link href="/dashboard/create" className="btn btn-primary mt-4">Start Writing</Link>
            </div>
          )}
        </div>
      </section>

      {/* Why We Are Different Section */}
      <section className="section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="section-title">
            <h2>📈 Why Our Website is Different</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem' }}>
            <p>Unlike other websites, we focus on:</p>
            <ul style={{ marginBottom: '2rem' }}>
              <li style={{ marginBottom: '1rem' }}>✅ <strong>Providing real and practical information</strong></li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong>Writing easy-to-understand content</strong></li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong>Sharing authentic earning methods</strong></li>
              <li style={{ marginBottom: '1rem' }}>✅ <strong>Helping beginners step-by-step</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section text-center">
        <div className="container">
          <h2>📢 Take Action Today</h2>
          <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
            Join our community and take your knowledge to the next level.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            Join as Author
          </Link>
        </div>
      </section>
    </div>
  );
}
