'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
  categories: Category[];
  posts: Post[];
  initialCategorySlug?: string;
}

export default function CategoryExplorer({
  categories,
  posts,
  initialCategorySlug = 'all',
}: CategoryExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialCategorySlug);

  const filteredPosts =
    selectedSlug === 'all'
      ? posts
      : posts.filter((p) => p.category?.slug === selectedSlug || p.categoryId === selectedSlug);

  const currentCategory =
    selectedSlug === 'all'
      ? null
      : categories.find((c) => c.slug === selectedSlug);

  return (
    <div className="container" style={{ padding: '3.5rem 2rem 6rem 2rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
            fontWeight: '900',
            color: '#3E2618',
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-outfit, sans-serif)',
          }}
        >
          Categories
        </h1>
        <p style={{ color: '#666666', fontSize: '1.05rem', margin: 0, fontWeight: '500' }}>
          {currentCategory?.description ||
            'Explore human-crafted articles, comprehensive guides, and actionable insights across all topics.'}
        </p>
      </div>

      {/* Main Layout: Left Sidebar + Right Card Grid */}
      <div className="category-layout">
        {/* Left Sticky Sidebar */}
        <aside className="category-sidebar">
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8DFD8',
              borderRadius: '16px',
              padding: '1.25rem 1rem',
              boxShadow: '0 2px 10px rgba(62, 38, 24, 0.03)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#6B4226',
                padding: '0.4rem 0.8rem 0.8rem 0.8rem',
                borderBottom: '1px solid #F5EDE4',
                marginBottom: '0.6rem',
              }}
            >
              Filter by Topic
            </div>

            {/* All Pill */}
            <button
              type="button"
              onClick={() => setSelectedSlug('all')}
              className={`category-pill-btn ${selectedSlug === 'all' ? 'active' : ''}`}
            >
              All Topics ({posts.length})
            </button>

            {/* Dynamic Categories from Dashboard */}
            {categories.map((cat) => {
              const count = posts.filter((p) => p.category?.slug === cat.slug || p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedSlug(cat.slug)}
                  className={`category-pill-btn ${selectedSlug === cat.slug ? 'active' : ''}`}
                >
                  {cat.name} {count > 0 && <span style={{ opacity: 0.6, fontSize: '0.8rem', float: 'right' }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Main Grid */}
        <main>
          {filteredPosts.length > 0 ? (
            <div className="blog-grid-livesession">
              {filteredPosts.map((post) => {
                const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <article key={post.id} className="blog-card-livesession fade-in">
                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Featured / Cover Image */}
                      <div className="img-container">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
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

                        {/* Excerpt */}
                        <p className="blog-card-excerpt">{post.excerpt}</p>

                        {/* Author Info */}
                        <div className="blog-card-author">
                          {post.author?.image ? (
                            <img
                              src={post.author.image}
                              alt={post.author.username || 'Author'}
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
                Articles created from the dashboard will automatically display here.
              </p>
              <button
                type="button"
                onClick={() => setSelectedSlug('all')}
                className="vip-btn-primary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
              >
                View All Topics
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
