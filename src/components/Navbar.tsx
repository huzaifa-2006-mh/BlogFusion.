'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo-link">
          <div className="logo-container">
            <span className="logo-text">
              Blog<span className="logo-accent">Fusion</span>
            </span>
          </div>
        </Link>
        
        {/* Mobile Menu Toggle (Simplified) */}
        <input type="checkbox" id="nav-toggle" style={{ display: 'none' }} />
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>

        <nav className="nav-links">
          <div className="nav-close">
            <label htmlFor="nav-toggle" style={{ cursor: 'pointer', fontSize: '2rem', display: 'block', textAlign: 'right', padding: '1rem' }}>&times;</label>
          </div>
          <Link href="/">Home</Link>
          <Link href="/category">Topics</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
