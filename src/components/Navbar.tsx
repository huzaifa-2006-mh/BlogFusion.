'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠', desc: 'Latest articles & highlights' },
    { label: 'Topics', href: '/category', icon: '📂', desc: 'Browse all categories & tags' },
    { label: 'About Us', href: '/about', icon: '✨', desc: 'Our mission & editorial team' },
    { label: 'Contact', href: '/contact', icon: '✉️', desc: 'Get in touch & queries' },
  ];

  return (
    <header
      className="main-navbar"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8DFD8',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.85rem',
          paddingBottom: '0.85rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6B4226 0%, #3E2618 100%)',
              padding: '2px',
              boxShadow: '0 4px 12px rgba(107, 66, 38, 0.18)',
            }}
          >
            <img
              src="/logo.png"
              alt="Blog Fusion"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
                color: '#3E2618',
                fontFamily: 'var(--font-poppins), sans-serif',
              }}
            >
              Blog<span style={{ color: '#6B4226' }}>Fusion</span>
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#666666',
              }}
            >
              Knowledge Journal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="desktop-nav-items"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '9999px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '750' : '600',
                  color: isActive ? '#6B4226' : '#222222',
                  background: isActive ? '#F5EDE4' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}

          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/category"
              className="vip-btn-primary"
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                borderRadius: '9999px',
              }}
            >
              <span>Explore Topics</span>
              <span style={{ fontSize: '0.9rem' }}>&rarr;</span>
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer / Overlay Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mobile-nav-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6B4226 0%, #3E2618 100%)',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(107, 66, 38, 0.2)',
                  }}
                >
                  <img src="/logo.png" alt="Blog Fusion" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.15rem', color: '#3E2618', lineHeight: '1.1', fontFamily: 'var(--font-poppins), sans-serif' }}>
                    Blog<span style={{ color: '#6B4226' }}>Fusion</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888888' }}>
                    Navigation Menu
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Nav Items */}
            <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B4226', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>
              Navigation Links
            </div>

            <nav className="mobile-nav-links">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <div>
                        <div className="mobile-nav-item-title">{item.label}</div>
                        <div className="mobile-nav-item-desc">{item.desc}</div>
                      </div>
                    </div>
                    <span className="mobile-nav-arrow">&rsaquo;</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick action card */}
            <div className="mobile-nav-cta-card">
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3E2618', marginBottom: '0.2rem' }}>
                ✦ Knowledge Spheres
              </div>
              <p style={{ fontSize: '0.78rem', color: '#666666', margin: '0 0 0.85rem 0', lineHeight: '1.4' }}>
                Discover guides in AI, Finance, Tech, Health and more.
              </p>
              <Link
                href="/category"
                onClick={() => setMobileMenuOpen(false)}
                className="vip-btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.88rem',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 14px rgba(107, 66, 38, 0.25)',
                }}
              >
                <span>Browse All Topics</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Footer */}
            <div className="mobile-nav-footer">
              <div style={{ fontSize: '0.72rem', color: '#888888', textAlign: 'center' }}>
                Blog Fusion &bull; Ideas, Insights & Knowledge
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

