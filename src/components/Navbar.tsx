'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const navItems = [
  { label: 'Home', href: '/', icon: '🏠', desc: 'Latest articles & highlights' },
  { label: 'Topics', href: '/category', icon: '📂', desc: 'Browse all categories & tags' },
  { label: 'About Us', href: '/about', icon: '✨', desc: 'Our mission & editorial team' },
  { label: 'Contact', href: '/contact', icon: '✉️', desc: 'Get in touch & queries' },
];

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
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus management & keyboard navigation (Escape + Tab focus trap)
  useEffect(() => {
    if (!open) return;

    // Focus close button on open
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={`mobile-nav-overlay${open ? ' is-open' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <aside
        ref={drawerRef}
        className="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-heading"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visually hidden heading for screen readers to satisfy WCAG dialog labeling */}
        <h2
          id="mobile-nav-heading"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          Site Navigation Menu
        </h2>

        <div className="mobile-nav-header">
          <Link href="/" onClick={onClose} className="mobile-nav-brand">
            <span className="mobile-nav-brand-mark">
              <img src="/logo.webp" alt="Blog Fusion logo" width="34" height="34" decoding="async" />
            </span>
            <span>
              <span className="mobile-nav-brand-title">
                Blog<span>Fusion</span>
              </span>
              <span className="mobile-nav-brand-sub">Menu</span>
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <p className="mobile-nav-section-label">Pages</p>

        <nav className="mobile-nav-links" aria-label="Mobile Navigation Links">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`mobile-nav-link${isActive ? ' active' : ''}`}
              >
                <span className="mobile-nav-link-main">
                  <span className="mobile-nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>
                    <span className="mobile-nav-item-title">{item.label}</span>
                    <span className="mobile-nav-item-desc">{item.desc}</span>
                  </span>
                </span>
                <span className="mobile-nav-arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mobile-nav-cta-card">
          <p className="mobile-nav-cta-kicker">Explore</p>
          <p className="mobile-nav-cta-title">All Knowledge Topics</p>
          <Link href="/category" onClick={onClose} className="mobile-nav-cta-btn">
            Browse Topics →
          </Link>
        </div>

        <p className="mobile-nav-footer">© {new Date().getFullYear()} Blog Fusion</p>
      </aside>
    </div>,
    document.body
  );
}

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    if (!mobileMenuOpen && toggleBtnRef.current) {
      // Return focus to toggle button when drawer closes
      toggleBtnRef.current.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  return (
    <>
      <header className="main-navbar">
        <div className="container main-navbar-inner">
          <Link href="/" className="main-navbar-brand">
            <span className="main-navbar-logo">
              <img src="/logo.webp" alt="Blog Fusion" width="36" height="36" decoding="async" fetchPriority="high" />
            </span>
            <span>
              <span className="main-navbar-title">
                Blog<span>Fusion</span>
              </span>
              <span className="main-navbar-tagline">Knowledge Journal</span>
            </span>
          </Link>

          <nav className="desktop-nav-items">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={`desktop-nav-link${isActive ? ' active' : ''}`}>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/category" className="vip-btn-primary desktop-nav-cta">
              <span>Explore Topics</span>
              <span>&rarr;</span>
            </Link>
          </nav>

          <button
            ref={toggleBtnRef}
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

      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} pathname={pathname} />
    </>
  );
};

export default Navbar;
