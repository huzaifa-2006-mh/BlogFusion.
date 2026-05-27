'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  return (
    <footer className="footer-minimal">
      <div className="container">
        {/* Navigation Links */}
        <nav className="footer-nav">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/category">Topics</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </nav>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://github.com/huzaifa-2006-mh" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61590547042139" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.linkedin.com/in/mhssoftwarehouse/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        {/* Copyright Section */}
        <div className="footer-copy">
          <p>
            &copy; 2020 — {new Date().getFullYear()} Blog Fusion. All rights reserved.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Designed and Developed by <a href="https://mhs-tech-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>MHS Tech</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
