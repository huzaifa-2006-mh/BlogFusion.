// Last updated: 2026-05-17
import Link from 'next/link';
import prisma from '@/lib/prisma';

import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/', {
    title: 'Blog Fusion | Best Platform for Tech, Online Earning, Jobs & Entertainment Blogs',
    description: 'Welcome to Blog Fusion, a complete multi-niche blog.',
  });
}

export default async function Home() {
  let categoriesWithPosts: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  try {
    categoriesWithPosts = await prisma.category.findMany({
      where: { 
        showOnHome: true 
      },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 10, // Fetch up to 10 posts per category (supports up to 2 balanced blocks of 5)
          include: { category: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch data:', error);
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
                    Blog Fusion is your go-to resource for mastering Google apps and modern productivity tools. Created by Muhammad Huzaifa we've been helping millions of users since 2020 with cle[...]
                </p>
                <p>
                    Automate your workflow with Google Sheets, streamline your inbox with custom Gmail routines, build powerful no-code workflows, or master the latest tech trends. Our popular Goo[...]
                </p>
            </div>

            {/* Right Column: Quote Box */}
            <div style={{ paddingLeft: '2rem', borderLeft: '1px solid #ff4b91' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    "Independent and unbiased. No sponsored content, no paid endorsements, no brand partnerships. Just honest tech guidance you can trust."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', backgroundColor: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    </div>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '1rem', color: 'var(--text-primary)' }}>Muhammad Huzaifa</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Founder, Blog Fusion</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repeating Sections for each Category marked showOnHome: true */}
      {categoriesWithPosts.length > 0 ? (
        categoriesWithPosts.map((category) => {
          const posts = category.posts;
          if (posts.length === 0) return null;

          // Split category posts into blocks of 5 (1 featured + 1 regular left, 3 regular right)
          const blocks: any[][] = [];
          for (let i = 0; i < posts.length; i += 5) {
            blocks.push(posts.slice(i, i + 5));
          }

          return (
            <section key={category.id} className="section" style={{ paddingBottom: '1.8rem', borderTop: '1px solid #f1f5f9' }}>
              <div className="container">
                {blocks.map((block, blockIdx) => (
                  <div key={blockIdx} className="blog-layout" style={{ marginBottom: '2rem' }}>
                    {/* Left Column: Featured + Post 3 */}
                    <div className="featured-column" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {/* Featured Post (Large Left) */}
                      {block[0] && (
                        <div className="featured-post">
                          <Link href={`/category/${category.slug}`} style={{ textDecoration: 'none' }}>
                            <span className="homepage-category-tag">
                              {category.name} &rarr;
                            </span>
                          </Link>
                          <Link href={`/blog/${block[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2 style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem', fontWeight: '800' }}>
                              {block[0].title}
                            </h2>
                            {block[0].shortDescription && (
                              <p style={{ fontSize: '1.2rem', color: '#334155', fontWeight: '600', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                  {block[0].shortDescription}
                              </p>
                            )}
                          </Link>
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
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center" style={{ padding: '6rem 0', opacity: 0.5 }}>
          <p style={{ fontSize: '1.2rem' }}>No featured categories or blogs found yet.</p>
        </div>
      )}
    </div>
  );
}
