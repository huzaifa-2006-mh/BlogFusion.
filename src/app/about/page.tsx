import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/about', {
    title: 'About Us | Blog Fusion - Ideas, Insights & Knowledge',
    description:
      'Learn about Blog Fusion, our mission, what we cover, content values, and our editorial standards.',
  });
}

const CORE_VALUES = [
  {
    num: '01',
    name: 'Clear and reader-friendly',
    desc: 'We demystify intricate topics into clean, accessible prose designed for effortless comprehension without robotic jargon.',
  },
  {
    num: '02',
    name: 'Practical and useful',
    desc: 'Every published piece prioritizes genuine utility, providing frameworks, tools, and actionable guidance you can immediately execute.',
  },
  {
    num: '03',
    name: 'Carefully researched',
    desc: 'We rely on credible references, verified data, and rigorous editorial scrutiny before any recommendation is published.',
  },
  {
    num: '04',
    name: 'Relevant to modern life',
    desc: 'Tailored to the technological advancements, economic shifts, and career dynamics shaping today’s fast-moving world.',
  },
  {
    num: '05',
    name: 'Regularly reviewed and updated',
    desc: 'Information evolves; our editorial desk regularly re-evaluates, refines, and refreshes publications to keep them timely.',
  },
];

const AUDIENCE_GROUPS = [
  {
    title: 'Students & Lifelong Learners',
    desc: 'Seeking reliable educational resources, study methodologies, and emerging skill trajectories.',
  },
  {
    title: 'Working Professionals',
    desc: 'Navigating career advancement, workplace tools, leadership frameworks, and high-impact productivity.',
  },
  {
    title: 'Founders & Digital Builders',
    desc: 'Exploring scalable software tools, operational workflows, and strategic market perspectives.',
  },
  {
    title: 'Investors & Market Traders',
    desc: 'Strengthening financial literacy, asset mechanics, and rational risk discipline.',
  },
  {
    title: 'Technology Enthusiasts',
    desc: 'Tracking the frontier of artificial intelligence, computational tools, and digital platforms.',
  },
  {
    title: 'Health-Conscious Individuals',
    desc: 'Building sustainable, science-backed routines for wellness, nutrition, and daily vitality.',
  },
];

export default async function About() {
  let dbCategories: any[] = [];

  try {
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
    console.error('Database query error in About page:', error);
  }

  return (
    <div style={{ background: '#FFFFFF', color: '#222222', fontFamily: 'var(--font-opensans), sans-serif', overflowX: 'hidden' }}>
      
      {/* Editorial Top Bar */}
      <div
        style={{
          borderBottom: '1px solid #E8DFD8',
          padding: '0.65rem 0',
          fontSize: '13px',
          color: '#666666',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontWeight: '750',
          background: '#F5EDE4',
          fontFamily: 'var(--font-poppins), sans-serif',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Publication Profile • Blog Fusion</span>
          <span style={{ color: '#6B4226' }}>✦ Independent Knowledge Journal</span>
        </div>
      </div>

      {/* Hero Section: Split with Real Editorial Image */}
      <section style={{ padding: '4.5rem 0 4rem 0', borderBottom: '1px solid #E8DFD8', background: 'linear-gradient(180deg, #FBF8F5 0%, #FFFFFF 100%)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Narrative */}
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
                  fontSize: '13px',
                  fontWeight: '750',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                <span>✦ About Our Publication</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(28px, 4.5vw, 36px)',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  color: '#3E2618',
                  letterSpacing: '-0.025em',
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                Clear, Reliable Knowledge for a{' '}
                <span style={{ color: '#6B4226' }}>Better Future</span>
              </h1>

              <p
                style={{
                  fontSize: '17px',
                  lineHeight: '1.75',
                  color: '#222222',
                  fontWeight: '600',
                  marginBottom: '1rem',
                }}
              >
                Welcome to <strong style={{ color: '#3E2618', fontWeight: '800' }}>Blog Fusion</strong> — an independent publication created for thinkers, builders, and lifelong learners who value substance over noise.
              </p>

              <p
                style={{
                  fontSize: '17px',
                  lineHeight: '1.75',
                  color: '#666666',
                  marginBottom: '2rem',
                }}
              >
                In a fast-accelerating world, reliable information is essential. We distill complex technological breakthroughs, economic dynamics, career shifts, and wellness research into lucid, actionable guides designed to help you make sound, confident decisions.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/category"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#6B4226',
                    color: '#FFFFFF',
                    padding: '0.85rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: '750',
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(107, 66, 38, 0.25)',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  <span>Explore All Topics</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#F5EDE4',
                    color: '#3E2618',
                    padding: '0.85rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    fontSize: '15px',
                    textDecoration: 'none',
                    border: '1px solid #E8DFD8',
                    fontFamily: 'var(--font-poppins), sans-serif',
                  }}
                >
                  Contact Editorial Desk
                </Link>
              </div>
            </div>

            {/* Right Photo Showcase */}
            <div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px -10px rgba(62, 38, 24, 0.12)',
                  border: '1px solid #E8DFD8',
                }}
              >
                <div style={{ height: '380px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000&auto=format&fit=crop"
                    alt="Editorial workspace - Blog Fusion"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#6B4226', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    ✦ Editorial Standard
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#3E2618', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    100% Unbiased • Research-Backed • Regularly Updated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Cover Section (Dynamic from Database) */}
      {dbCategories.length > 0 && (
        <section style={{ padding: '5.5rem 0', background: '#F5EDE4', borderBottom: '1px solid #E8DFD8' }}>
          <div className="container">
            <div style={{ maxWidth: '750px', marginBottom: '3.5rem' }}>
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
                Editorial Focus
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px, 3.8vw, 36px)',
                  fontWeight: '800',
                  letterSpacing: '-0.025em',
                  color: '#3E2618',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-poppins), sans-serif',
                }}
              >
                What We Cover
              </h2>
              <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
                Our publication focuses on topics where verified, practical knowledge produces the greatest long-term impact on daily life and career success.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                    {/* Real Image */}
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

      {/* 5 Core Values Section */}
      <section style={{ padding: '5.5rem 0', background: '#FFFFFF', borderBottom: '1px solid #E8DFD8' }}>
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
              Guiding Principles
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                color: '#3E2618',
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}
            >
              Our Core Publishing Values
            </h2>
            <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
              Every article, tutorial, and framework published on Blog Fusion adheres to five core commitments:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {CORE_VALUES.map((val) => (
              <div
                key={val.num}
                className="vip-card-glow"
                style={{
                  background: '#F5EDE4',
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
                      color: '#FFFFFF',
                      background: '#6B4226',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-poppins), sans-serif',
                    }}
                  >
                    {val.num}
                  </span>
                  <span style={{ height: '2px', width: '24px', background: '#6B4226' }} />
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
                  {val.name}
                </h3>
                <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Groups: Who Reads Blog Fusion? */}
      <section style={{ padding: '5.5rem 0', background: '#F5EDE4', borderBottom: '1px solid #E8DFD8' }}>
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
              Audience & Reach
            </span>
            <h2
              style={{
                fontSize: 'clamp(26px, 3.8vw, 36px)',
                fontWeight: '800',
                letterSpacing: '-0.025em',
                color: '#3E2618',
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}
            >
              Who Reads Blog Fusion?
            </h2>
            <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
              Our publication is tailored for proactive individuals who seek practical knowledge to navigate modern life with confidence:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {AUDIENCE_GROUPS.map((aud, index) => (
              <div
                key={index}
                className="vip-card-glow"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8DFD8',
                  borderRadius: '16px',
                  padding: '2.25rem',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#6B4226', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', fontFamily: 'var(--font-poppins), sans-serif' }}>
                  Audience Group {String(index + 1).padStart(2, '0')}
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
                  {aud.title}
                </h3>
                <p style={{ fontSize: '17px', color: '#666666', lineHeight: '1.7', margin: 0 }}>
                  {aud.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Disclaimer Callout */}
      <section style={{ padding: '4.5rem 0', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              background: '#F5EDE4',
              border: '1px solid #E8DFD8',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B4226', fontFamily: 'var(--font-poppins), sans-serif' }}>
                ✦ Important Editorial Notice
              </span>
            </div>
            <p
              style={{
                fontSize: '15px',
                color: '#666666',
                lineHeight: '1.75',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              The health, medical, and financial guidance published on Blog Fusion is provided for educational and informational purposes only. It does not constitute professional medical, nutritional, legal, or investment advice. Always consult with qualified professionals before making significant health or investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
