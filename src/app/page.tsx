import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/', {
    title: 'Blog Fusion | Best Platform for Tech, Online Earning, Jobs & Entertainment Blogs',
    description: 'Welcome to Blog Fusion — technology guides, programming tutorials, online earning tips, jobs, and entertainment blogs.',
  });
}

export default async function Home() {
  let categoriesWithPosts: any[] = [];

  try {
    categoriesWithPosts = await prisma.category.findMany({
      where: {
        showOnHome: true,
      },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { category: true },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero" style={{ padding: '3rem 0' }}>
        <div className="container">
          <span className="hero-label">Tech à la carte</span>
          <h1 style={{ marginBottom: '1.2rem' }}>Blog Fusion</h1>
          <p className="lead" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Trusted tech guides and practical software tools. Helping millions work smarter since 2020.
          </p>

          <div className="hero-grid">
            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Blog Fusion is your go-to resource for mastering Google apps, online earning methods, software programming, and modern productivity tools. Created by Muhammad Huzaifa, we've been helping millions of readers with clear, step-by-step guides.
              </p>
              <p>
                Automate your workflow, streamline your inbox, build powerful no-code routines, or master the latest tech trends with our curated blogs.
              </p>
            </div>

            <aside style={{ paddingLeft: '2rem', borderLeft: '1px solid #ff4b91' }}>
              <blockquote style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.4', margin: 0 }}>
                "Independent and unbiased. No sponsored content, no paid endorsements, no brand partnerships. Just honest tech guidance you can trust."
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ width: '45px', height: '45px', backgroundColor: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  MH
                </div>
                <div>
                  <h3 style={{ margin: '0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '700' }}>Muhammad Huzaifa</h3>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Founder, Blog Fusion</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Repeating Sections for each Category */}
      {categoriesWithPosts.length > 0 ? (
        categoriesWithPosts.map((category) => {
          const posts = category.posts;
          if (posts.length === 0) return null;

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
                      {block[0] && (
                        <article className="featured-post">
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
                        </article>
                      )}

                      {block[3] && (
                        <article key={block[3].id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                          <Link href={`/blog/${block[3].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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

                    {/* Secondary Posts */}
                    <div className="secondary-list">
                      {[block[1], block[2], block[4]].filter(Boolean).map((post) => (
                        <article key={post.id} style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                          <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
