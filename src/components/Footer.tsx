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
          <Link href="/faqs">FAQs</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </nav>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://github.com/huzaifa-2006-mh" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.93c.58.11.79-.25.79-.56v-2.17c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.57.24 2.73.12 3.02.73.81 1.17 1.85 1.17 3.11 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61590547042139" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.5h3.05V9.4c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/mhssoftwarehouse/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.05-1.86-3.05-1.87 0-2.15 1.46-2.15 2.96v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
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
