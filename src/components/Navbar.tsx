'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Home', href: '/', icon: '🏠', desc: 'Latest articles & highlights' },
  { label: 'Topics', href: '/category', icon: '📂', desc: 'Browse all categories & tags' },
  { label: 'About Us', href: '/about', icon: '✨', desc: 'Our mission & editorial team' },
  { label: 'Contact', href: '/contact', icon: '✉️', desc: 'Get in touch & queries' },
];

/* ─── Mobile Drawer (rendered via portal onto document.body) ─── */
function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(20, 10, 5, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'mobileNavFadeIn 0.22s ease-out forwards',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '82%',
          maxWidth: '360px',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: '-16px 0 48px rgba(62, 38, 24, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          animation: 'mobileNavSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          overflowY: 'auto',
          borderLeft: '1px solid #E8DFD8',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.4rem 1.1rem',
            borderBottom: '1px solid #F0E8E0',
            background: 'linear-gradient(135deg, #FDFAF7 0%, #F8F2EC 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #6B4226 0%, #3E2618 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(107, 66, 38, 0.25)',
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt="Blog Fusion"
                style={{ width: '100%', height: '100%', borderRadius: '9px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  color: '#3E2618',
                  lineHeight: '1.1',
                  fontFamily: 'var(--font-poppins), sans-serif',
                  letterSpacing: '-0.02em',
                }}
              >
                Blog<span style={{ color: '#6B4226' }}>Fusion</span>
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#999999',
                  marginTop: '1px',
                }}
              >
                Navigation
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid #E0D4CA',
              background: '#FFFFFF',
              color: '#6B4226',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#6B4226';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#6B4226';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF';
              (e.currentTarget as HTMLButtonElement).style.color = '#6B4226';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0D4CA';
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Section label ── */}
        <div
          style={{
            padding: '1.1rem 1.4rem 0.5rem',
            fontSize: '0.68rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#9C6644',
          }}
        >
          Pages
        </div>

        {/* ── Nav Links ── */}
        <nav style={{ padding: '0 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  background: isActive ? '#F5EDE4' : '#FDFAF7',
                  border: isActive ? '1.5px solid #C8966E' : '1.5px solid #EDE4DA',
                  textDecoration: 'none',
                  transition: 'all 0.22s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(107,66,38,0.10)' : '0 1px 4px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isActive ? '#FFFFFF' : '#F0E8E0',
                      border: '1px solid #E0D4CA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '0.97rem',
                        fontWeight: isActive ? '800' : '700',
                        color: isActive ? '#6B4226' : '#2D1F14',
                        lineHeight: '1.2',
                        fontFamily: 'var(--font-poppins), sans-serif',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.73rem',
                        color: '#888888',
                        marginTop: '2px',
                        lineHeight: '1.25',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '1.4rem',
                    color: isActive ? '#6B4226' : '#BBAA9E',
                    fontWeight: '400',
                    transition: 'transform 0.2s ease',
                    lineHeight: 1,
                    paddingLeft: '0.3rem',
                  }}
                >
                  ›
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── Divider ── */}
        <div style={{ margin: '1.25rem 1.4rem 0', borderTop: '1px solid #EEE5DC' }} />

        {/* ── CTA Card ── */}
        <div
          style={{
            margin: '1rem 0.85rem 0',
            background: 'linear-gradient(135deg, #3E2618 0%, #6B4226 100%)',
            borderRadius: '18px',
            padding: '1.35rem 1.2rem',
            boxShadow: '0 8px 24px rgba(62, 38, 24, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '0.35rem',
            }}
          >
            ✦ Explore
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: '800',
              color: '#FFFFFF',
              lineHeight: '1.3',
              marginBottom: '0.35rem',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          >
            All Knowledge Topics
          </div>
          <p
            style={{
              fontSize: '0.77rem',
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 1rem 0',
              lineHeight: '1.45',
            }}
          >
            AI, Finance, Tech, Health and more — all in one place.
          </p>
          <Link
            href="/category"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              background: '#FFFFFF',
              color: '#6B4226',
              fontWeight: '800',
              fontSize: '0.88rem',
              borderRadius: '9999px',
              padding: '0.7rem 1.25rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            <span>Browse All Topics</span>
            <span>→</span>
          </Link>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 'auto',
            padding: '1.25rem 1.4rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#AAAAAA',
            borderTop: '1px solid #F0E8E0',
          }}
        >
          © {new Date().getFullYear()} Blog Fusion · Ideas & Insights
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Main Navbar ─── */
const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  return (
    <>
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
          >
            <div
              style={{
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
                style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
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

          {/* Desktop Navigation */}
          <nav
            className="desktop-nav-items"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '9999px',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? '800' : '600',
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
            <div style={{ marginLeft: '1rem' }}>
              <Link
                href="/category"
                className="vip-btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '9999px' }}
              >
                <span>Explore Topics</span>
                <span style={{ fontSize: '0.9rem' }}>&rarr;</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`mobile-nav-toggle-btn${mobileMenuOpen ? ' is-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Portal-rendered mobile drawer — outside <header> stacking context */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;
