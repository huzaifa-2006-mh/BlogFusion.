'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EmailSubscription from '@/components/EmailSubscription';

const Footer = () => {
  const pathname = usePathname();
  
  if (pathname.startsWith('/dashboard') || pathname === '/login') return null;

  return (
    <footer className="footer-minimal" style={{ background: '#F5EDE4', borderTop: '1px solid #E8DFD8', paddingTop: '3rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Newsletter Subscription */}
        <div style={{ borderBottom: '1px solid #E2D7CE', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <EmailSubscription />
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/about" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>About</Link>
          <Link href="/contact" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>Contact</Link>
          <Link href="/category" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>Topics</Link>
          <Link href="/faqs" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>FAQs</Link>
          <Link href="/privacy-policy" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>Privacy Policy</Link>
          <Link href="/terms-and-conditions" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>Terms & Conditions</Link>
          <Link href="/disclaimer" style={{ color: '#666666', fontWeight: '600', fontSize: '0.9rem' }}>Disclaimer</Link>
        </nav>

        {/* Social Media Icons */}
        <div className="footer-social" style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '1.5rem', color: '#6B4226' }}>
          <a href="https://www.facebook.com/profile.php?id=61590547042139" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#6B4226' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.5h3.05V9.4c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/mhssoftwarehouse/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#6B4226' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.15 1.46-2.15 2.96v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>

        {/* Copyright Section */}
        <div className="footer-copy" style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666666' }}>
          <p>
            &copy; 2020 — {new Date().getFullYear()} Blog Fusion. All rights reserved.
          </p>
          <p style={{ marginTop: '0.4rem' }}>
            Designed and Developed by <a href="https://mhs-tech-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', color: '#6B4226' }}>MHS Tech</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
