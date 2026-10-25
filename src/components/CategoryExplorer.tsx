'use client';

import Link from 'next/link';
import { optimizeImageUrl, getResponsiveImageSrcSet } from '@/lib/imageOptimizer';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    posts: number;
  };
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  shortDescription?: string | null;
  coverImage?: string | null;
  createdAt: string | Date;
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
  author?: {
    username: string;
    image?: string | null;
  } | null;
}

interface CategoryExplorerProps {
  categories: CategoryItem[];
  posts: PostItem[];
  initialCategorySlug?: string;
  totalPostCount?: number;
  activeCategoryTitle?: string;
  activeCategoryDescription?: string | null;
}

export default function CategoryExplorer({
  categories,
  posts,
  initialCategorySlug = 'all',
  totalPostCount,
  activeCategoryTitle,
  activeCategoryDescription,
}: CategoryExplorerProps) {
  const selectedSlug = initialCategorySlug;

  const currentCategory =
    selectedSlug === 'all'
      ? null
      : categories.find((c) => c.slug === selectedSlug);

  const calculatedTotalCount =
    totalPostCount ??
    categories.reduce((acc, cat) => acc + (cat._count?.posts || 0), 0);

  const headingTitle = activeCategoryTitle || (currentCategory ? currentCategory.name : 'All Categories');
  const headingDesc = activeCategoryDescription || currentCategory?.description || 'Explore human-crafted articles, comprehensive guides, and actionable insights across all topics.';

  return (
    <div className="container category-page-container" style={{ padding: '3.5rem 2rem 6rem 2rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: '900',
            color: '#3E2618',
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-poppins), sans-serif',
          }}
        >
          {headingTitle}
        </h1>
        <p style={{ color: '#666666', fontSize: '1rem', margin: 0, fontWeight: '500', lineHeight: '1.6' }}>
          {headingDesc}
        </p>
      </div>

      {/* Main Layout: Left Sidebar + Right Card Grid */}
      <div className="category-layout">
        {/* Sticky Sidebar / Mobile Pill Row */}
        <aside className="category-sidebar">
          <div className="category-sidebar-card">
            <div className="category-sidebar-title">
              Filter by Topic
            </div>

            <div className="category-pills-list">
              {/* All Pill */}
              <Link
                href="/category"
                prefetch={false}
                className={`category-pill-btn ${selectedSlug === 'all' ? 'active' : ''}`}
              >
                <span>All Topics</span>
                {calculatedTotalCount > 0 && (
                  <span className="category-count-badge">({calculatedTotalCount})</span>
                )}
              </Link>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const count = cat._count?.posts ?? 0;
                const isActive = selectedSlug === cat.slug;

                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    prefetch={false}
                    className={`category-pill-btn ${isActive ? 'active' : ''}`}
                  >
                    <span>{cat.name}</span>
                    {count > 0 && <span className="category-count-badge">{count}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Main Grid */}
        <main>
          {posts.length > 0 ? (
            <div className="blog-grid-livesession">
              {posts.map((post) => {
                const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const optimizedCover = optimizeImageUrl(post.coverImage, 600, 75);
                const srcSet = getResponsiveImageSrcSet(post.coverImage, [360, 600, 800]);

                return (
                  <article key={post.id} className="blog-card-livesession fade-in">
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      {/* Featured / Cover Image */}
                      <div className="img-container">
                        {post.coverImage ? (
                          <img
                            src={optimizedCover}
                            srcSet={srcSet}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                            alt={post.title}
                            width={600}
                            height={340}
                            loading="lazy"
                            decoding="async"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
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
                              fontSize: '1.2rem',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {post.category?.name || 'Blog Fusion'}
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="blog-card-body">
                        {/* Meta: Category • Date */}
                        <div className="blog-meta-badge">
                          <span className="cat">{post.category?.name}</span>
                          <span>•</span>
                          <span>{dateStr}</span>
                        </div>

                        {/* Title */}
                        <h2 className="blog-card-title">{post.title}</h2>

                        {/* Card Description */}
                        {(post.shortDescription || post.excerpt) && (
                          <p className="blog-card-excerpt">
                            {post.shortDescription || post.excerpt}
                          </p>
                        )}

                        {/* Author Info */}
                        <div className="blog-card-author">
                          {post.author?.image ? (
                            <img
                              src={optimizeImageUrl(post.author.image, 64, 80)}
                              alt={post.author.username || 'Author'}
                              width={32}
                              height={32}
                              loading="lazy"
                              decoding="async"
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="author-fallback">
                              {(post.author?.username || 'BF').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="name">
                            {post.author?.username
                              ? post.author.username.charAt(0).toUpperCase() + post.author.username.slice(1)
                              : 'Editorial Team'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px dashed #E8DFD8',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ fontSize: '1.3rem', color: '#3E2618', marginBottom: '0.5rem' }}>
                No articles in this category yet
              </h3>
              <p style={{ color: '#666666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Articles created for this topic will automatically display here.
              </p>
              <Link
                href="/category"
                className="vip-btn-primary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', display: 'inline-flex' }}
              >
                View All Topics
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
