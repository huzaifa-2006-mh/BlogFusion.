// Last updated: 2026-05-16
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let posts: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  let categories: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  try {
    [posts, categories] = await Promise.all([
      prisma.post.findMany({
        where: { 
          published: true,
          showOnHome: true
        },
        take: 8,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.findMany({
          take: 10
      })
    ]);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  // Split posts into blocks of 4 (1 featured + 3 secondary)
  const blocks: any[][] = [];
  for (let i = 0; i < posts.length; i += 4) {
    blocks.push(posts.slice(i, i + 4));
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 0' }}>
        <div className="container">
          <span className="hero-label">Tech à la carte</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>Blog Fusion</h1>
          <p className="lead" style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
            Trusted tech guides and practical software tools. Helping millions work smarter since 2020.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '5rem', alignItems: 'start' }}>
            {/* Left Column: Description */}
            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Blog Fusion is your go-to resource for mastering Google apps and modern productivity tools. Created by Muhammad Huzaifa we've been helping millions of users since 2020 with clear, practical guides that turn complex technology into simple solutions.
                </p>
                <p>
                    Automate your workflow with Google Sheets, streamline your inbox with custom Gmail routines, build powerful no-code workflows, or master the latest tech trends. Our popular Google Apps Script solutions save you time and make you more productive.
                </p>
            </div>

            {/* Right Column: Quote Box */}
            <div style={{ paddingLeft: '2rem', borderLeft: '1px solid #ff4b91' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    "Independent and unbiased. No sponsored content, no paid endorsements, no brand partnerships. Just honest tech guidance you can trust."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', backgroundColor: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>MH</div>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '1rem', color: 'var(--text-primary)' }}>Muhammad Huzaifa</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Founder, Blog Fusion</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category List Section */}
      <section style={{ background: '#f8f9fa', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
          <div className="container" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', whiteSpace: 'nowrap', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', color: '#64748b' }}>Topics:</span>
              {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/category/${cat.slug}`}
                    style={{ 
                        color: 'var(--text-primary)', 
                        fontWeight: '600', 
                        fontSize: '0.95rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '4px',
                        background: 'white',
                        border: '1px solid #e2e8f0'
                    }}
                  >
                      {cat.name}
                  </Link>
              ))}
          </div>
      </section>

      {/* Blog Blocks Section (Repeating 1 Featured + 3 Secondary) */}
      <section className="section">
        <div className="container">
          {blocks.length > 0 ? (
            blocks.map((block, blockIdx) => (
              <div key={blockIdx} className="blog-layout" style={{ marginBottom: '4rem' }}>
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

                {/* Secondary Posts (List Right) */}
                <div className="secondary-list">
                  {block.slice(1).map((post) => (
                    <article key={post.id} style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                          {post.title}
                        </h3>
                        {post.shortDescription && (
                            <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600', marginBottom: '0.75rem' }}>
                                {post.shortDescription}
                            </p>
                        )}
                      </Link>
                      <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5' }}>{post.excerpt}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center" style={{ padding: '4rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.2rem', color: '#888' }}>No blogs published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
