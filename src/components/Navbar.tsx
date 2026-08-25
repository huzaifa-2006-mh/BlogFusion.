'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Topics', href: '/category' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
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
      </div>
    </header>
  );
};

export default Navbar;

