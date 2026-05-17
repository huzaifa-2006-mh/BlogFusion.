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
        take: 10, // Fetch enough to show 2 blocks of (1+4)
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.findMany({
          where: { showOnHome: true },
          take: 10
      })
    ]);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  // Split posts into blocks of 5 (1 featured + 4 secondary)
  const blocks: any[][] = [];
  for (let i = 0; i < posts.length; i += 5) {
    blocks.push(posts.slice(i, i + 5));
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '3rem 0' }}>
        <div className="container">
          <span className="hero-label">Tech à la carte</span>
          <h1 style={{ marginBottom: '1.2rem' }}>Blog Fusion</h1>
          <p className="lead" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Trusted tech guides and practical software tools. Helping millions work smarter since 2020.
          </p>

          <div className="hero-grid">
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

      {/* Blog Blocks Section (Repeating 1 Featured + 1 Regular Left, 3 Regular Right) */}
      <section className="section" style={{ paddingBottom: '1rem' }}>
        <div className="container">
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
            <div className="text-center" style={{ padding: '4rem', background: '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.2rem', color: '#888' }}>No blogs published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
