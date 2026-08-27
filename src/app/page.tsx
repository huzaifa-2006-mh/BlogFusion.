import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/', {
    title: 'Blog Fusion | Ideas, Insights, and Knowledge for a Better Future',
    description:
      'Welcome to Blog Fusion — practical information, useful ideas, and the latest insights across technology, finance, education, careers, health, and fitness.',
  });
}

const WHY_CHOOSE_US = [
  {
    num: '01',
    title: 'Clear and reader-friendly',
    description:
      'We simplify complex topics into clean, accessible writing that is easy for everyone to read and understand without unnecessary jargon.',
  },
  {
    num: '02',
    title: 'Practical and useful',
    description:
      'Every article delivers real-world frameworks and actionable insights you can immediately apply to everyday personal and professional decisions.',
  },
  {
    num: '03',
    title: 'Carefully researched',
    description:
      'Our content is backed by verified references and rigorous editorial scrutiny to ensure total reliability and substance.',
  },
  {
    num: '04',
    title: 'Relevant to modern life',
    description:
      'Tailored to the technological advancements, economic shifts, and career dynamics shaping today’s fast-moving world.',
  },
  {
    num: '05',
    title: 'Regularly reviewed and updated',
    description:
      'Our publications are continuously reviewed and refreshed to guarantee the information remains accurate and timely.',
  },
  {
    num: '06',
    title: '100% Free and unbiased',
    description:
      'No paywalls, no sponsored bias, and no covert endorsements. Pure, honest knowledge dedicated to human growth and learning.',
  },
];

export default async function Home() {
  let allRecentPosts: any[] = [];
  let dbCategories: any[] = [];

  try {
    allRecentPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { category: true, author: true },
    });

    dbCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
        posts: {
          where: { published: true },
          take: 1,
          select: { coverImage: true },
        },
      },
    });
  } catch (error) {
    console.error('Database query error:', error);
  }

  const featuredLeadPost = allRecentPosts.length > 0 ? allRecentPosts[0] : null;

  return (
    <div style={{ background: '#FFFFFF', color: '#222222', fontFamily: 'var(--font-opensans), sans-serif', overflowX: 'hidden' }}>
      
      {/* Editorial Hero Section */}
      <section
        style={{
          padding: '4.5rem 0 4rem 0',
          borderBottom: '1px solid #E8DFD8',
          background: 'linear-gradient(180deg, #FBF8F5 0%, #FFFFFF 100%)',
        }}
      >
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Content Column */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '9999px',
                  background: '#F5EDE4',
                  border: '1px solid #E8DFD8',
                  color: '#6B4226',
                  fontSize: '0.78rem',
                  fontWeight: '750',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                <span>✦</span>
                <span>Editorial Knowledge Journal</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(28px, 4.2vw, 36px)',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  color: '#3E2618',
                  letterSpacing: '-0.025em',
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                Ideas, Insights, and Knowledge for a{' '}
                <span style={{ color: '#6B4226' }}>Better Future</span>
              </h1>

              <p
                style={{
                  fontSize: '17px',
                  lineHeight: '1.7',
                  color: '#222222',
                  marginBottom: '1rem',
                  fontWeight: '600',
                }}
              >
                Welcome to <strong style={{ color: '#3E2618', fontWeight: '800' }}>Blog Fusion</strong>, your trusted destination for practical information, useful ideas, and the latest insights across technology, finance, education, careers, health, and fitness.
              </p>

              <p
                style={{
                  fontSize: '17px',
                  lineHeight: '1.7',
                  color: '#666666',
                  marginBottom: '2rem',
                }}
              >
                We simplify complex topics and turn them into clear, helpful content that supports smarter decisions in everyday life.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: dbCategories.length > 0 ? '2.5rem' : '0' }}>
                <Link
                  href="/category"
                  className="vip-btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#6B4226',
                    color: '#FFFFFF',
                    padding: '0.85rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(107, 66, 38, 0.25)',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  <span>Explore Topics</span>
                  <span>&rarr;</span>
                </Link>

                <Link
                  href="/about"
                  className="vip-btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#F5EDE4',
                    color: '#3E2618',
                    padding: '0.85rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    fontSize: '16px',
                    textDecoration: 'none',
                    border: '1px solid #E8DFD8',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  About Blog Fusion
                </Link>
              </div>

              {/* Dynamic Topic Chips Created In Dashboard */}
              {dbCategories.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '750', color: '#6B4226', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    Topics:
                  </span>
                  {dbCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#3E2618',
                        background: '#FFFFFF',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        border: '1px solid #E8DFD8',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      #{cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Editorial Showcase Image */}
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px -10px rgba(62, 38, 24, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #E8DFD8',
                  background: '#F5EDE4',
                }}
              >
                <div style={{ height: '380px', width: '100%', overflow: 'hidden' }}>
                  {featuredLeadPost?.coverImage ? (
                    <Link href={`/blog/${featuredLeadPost.slug}`}>
                      <img
                        src={featuredLeadPost.coverImage}
                        alt={featuredLeadPost.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
                      alt="Blog Fusion - Ideas, Insights and Knowledge"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    left: '1.25rem',
                    right: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '1.1rem 1.4rem',
                    borderRadius: '16px',
                    border: '1px solid #E8DFD8',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#6B4226', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    ✦ Independent Publication
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#3E2618', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    {featuredLeadPost ? featuredLeadPost.title : 'Clear, reliable guidance for modern work and life.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Topics Section (Only renders categories created from dashboard) */}
      {dbCategories.length > 0 && (
        <section id="topics" style={{ padding: '5.5rem 0', background: '#F5EDE4', borderBottom: '1px solid #E8DFD8' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3.2rem',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderBottom: '2px solid #3E2618',
                paddingBottom: '1.25rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6B4226',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  Knowledge Spheres
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(26px, 3.8vw, 36px)',
                    fontWeight: '800',
                    letterSpacing: '-0.025em',
                    margin: 0,
                    color: '#3E2618',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  Explore Our Topics
                </h2>
              </div>
              <p style={{ margin: 0, color: '#666666', fontSize: '17px', maxWidth: '480px', lineHeight: '1.6' }}>
                Browse our specialized knowledge domains — each one dedicated to helping you make smarter decisions and build practical skills.
              </p>
            </div>

            <div
              className="topics-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '2rem',
              }}
            >
              {dbCategories.map((cat, index) => {
                const coverImage = cat.posts?.[0]?.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop';
                const postCount = cat._count?.posts || 0;

                return (
                  <div
                    key={cat.id}
                    className="vip-card-glow"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8DFD8',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Topic Cover Image */}
                    <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative', background: '#F5EDE4' }}>
                      <img
                        src={coverImage}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(62, 38, 24, 0.85)',
                          color: '#FFFFFF',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '800',
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div style={{ padding: '1.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '13px', fontWeight: '750', color: '#6B4226', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                        {postCount} {postCount === 1 ? 'Article' : 'Articles'}
                      </div>

                      <h3
                        style={{
                          fontSize: '22px',
                          fontWeight: '800',
                          color: '#3E2618',
                          marginBottom: '0.75rem',
                          fontFamily: 'var(--font-poppins), sans-serif',
                        }}
                      >
                        {cat.name}
                      </h3>

                      {cat.description && (
                        <p
                          style={{
                            fontSize: '17px',
                            lineHeight: '1.65',
                            color: '#666666',
                            marginBottom: '1.8rem',
                            flex: 1,
                          }}
                        >
                          {cat.description}
                        </p>
                      )}

                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F5EDE4' }}>
                        <Link
                          href={`/category/${cat.slug}`}
                          style={{
                            fontWeight: '750',
                            fontSize: '15px',
                            color: '#6B4226',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontFamily: 'var(--font-poppins), sans-serif',
                          }}
                        >
                          <span>Explore {cat.name}</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Real Recent Publications Grid (LiveSession Style from Dashboard) */}
      {allRecentPosts.length > 0 && (
        <section style={{ padding: '5.5rem 0', background: '#FFFFFF', borderBottom: '1px solid #E8DFD8' }}>
          <div className="container">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderBottom: '2px solid #3E2618',
                paddingBottom: '1.25rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6B4226',
                    display: 'block',
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  Latest Dispatches
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(26px, 3.8vw, 36px)',
                    fontWeight: '800',
                    letterSpacing: '-0.025em',
                    margin: 0,
                    color: '#3E2618',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  Recent Publications
                </h2>
              </div>
              <Link
                href="/category"
                className="vip-btn-secondary"
                style={{
                  padding: '0.6rem 1.4rem',
                  fontSize: '15px',
                  background: '#F5EDE4',
                  color: '#3E2618',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  border: '1px solid #E8DFD8',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                <span>View All Articles</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="blog-grid-livesession">
              {allRecentPosts.map((post) => {
                const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <article key={post.id} className="blog-card-livesession fade-in">
                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div className="img-container">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} loading="lazy" />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #F5EDE4 0%, #E8DFD8 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6B4226',
                              fontWeight: '800',
                              fontSize: '16px',
                              textTransform: 'uppercase',
                              fontFamily: 'var(--font-poppins), sans-serif',
                            }}
                          >
                            {post.category?.name || 'Blog Fusion'}
                          </div>
                        )}
                      </div>

                      <div className="blog-card-body">
                        <div className="blog-meta-badge">
                          <span className="cat">{post.category?.name || 'Article'}</span>
                          <span>•</span>
                          <span>{dateStr}</span>
                        </div>

                        <h3 className="blog-card-title">{post.title}</h3>
                        {(post.shortDescription || post.excerpt) && (
                          <p className="blog-card-excerpt">{post.shortDescription || post.excerpt}</p>
                        )}

                        <div className="blog-card-author">
                          {post.author?.image ? (
                            <img src={post.author.image} alt={post.author.username || 'Author'} />
                          ) : (
                            <div className="author-fallback">
                              {(post.author?.username || 'BF').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="name">
                            {post.author?.username || 'Editorial Desk'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Blog Fusion - 6 Standards */}
      <section style={{ padding: '6rem 0', background: '#F5EDE4', borderBottom: '1px solid #E8DFD8' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '3.5rem' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6B4226',
                display: 'block',
                marginBottom: '0.4rem',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}
            >
              Standards of Excellence
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                color: '#3E2618',
                marginBottom: '1rem',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}
            >
              Why Choose Blog Fusion?
            </h2>
            <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
              At Blog Fusion, we believe valuable information should be easy to find and understand. Our content is created to be practical, well-researched, and relevant to modern life.
            </p>
          </div>

          <div
            className="why-choose-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1.75rem',
            }}
          >
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.num}
                className="vip-card-glow"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8DFD8',
                  borderRadius: '16px',
                  padding: '2.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '800',
                      color: '#6B4226',
                      background: '#F5EDE4',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-poppins), sans-serif',
                    }}
                  >
                    {item.num}
                  </span>
                  <span style={{ height: '2px', width: '24px', background: '#E8DFD8' }} />
                </div>

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#3E2618',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover. Learn. Grow. (CTA Section) */}
      <section style={{ padding: '6rem 0', background: '#3E2618', color: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(245, 237, 228, 0.15)',
              border: '1px solid rgba(245, 237, 228, 0.3)',
              color: '#F5EDE4',
              fontSize: '13px',
              fontWeight: '750',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          >
            <span>✦ Knowledge Forward</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 36px)',
              fontWeight: '800',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          >
            Discover. Learn. Grow.
          </h2>

          <p style={{ fontSize: '17px', color: '#F5EDE4', lineHeight: '1.75', marginBottom: '1rem' }}>
            From understanding the latest AI tools to developing better financial habits, advancing your career, or improving your well-being, Blog Fusion brings valuable knowledge together in one convenient place.
          </p>

          <p style={{ fontSize: '16px', color: '#E8DFD8', lineHeight: '1.7', marginBottom: '2.5rem', fontStyle: 'italic' }}>
            Start exploring our latest articles and discover something useful today.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/category"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                color: '#3E2618',
                padding: '0.9rem 2.2rem',
                borderRadius: '9999px',
                fontWeight: '750',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                fontFamily: 'var(--font-poppins), sans-serif',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Explore All Topics</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.9rem 2.2rem',
                borderRadius: '9999px',
                fontWeight: '700',
                fontSize: '16px',
                textDecoration: 'none',
                fontFamily: 'var(--font-poppins), sans-serif',
                transition: 'all 0.25s ease',
              }}
            >
              About Our Mission
            </Link>
          </div>

          {/* Educational Disclaimer */}
          <div style={{ marginTop: '3rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#C9B8AD',
                lineHeight: '1.65',
                fontStyle: 'italic',
                maxWidth: '720px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              The health and financial information published on Blog Fusion is provided for general educational purposes only and should not replace advice from qualified medical or financial professionals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
