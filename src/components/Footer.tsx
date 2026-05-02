import Link from 'next/link';
import prisma from '@/lib/prisma';
import EmailSubscription from './EmailSubscription';

const Footer = async () => {
  let categories: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    // Only show top 4 categories to keep footer compact
    categories = await prisma.category.findMany({ take: 4 });
  } catch (error) {
    categories = [];
  }

  return (
    <footer className="footer">

      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <Link href="/" className="logo-link">
              <div className="logo-container">
                <img src="/logo.png" alt="BlogFusion" className="logo-img" />
                <span className="logo-fallback">BlogFusion<span className="highlight">.</span></span>
              </div>
            </Link>
            <p style={{ color: '#a8b2d1' }}>
              Your go-to platform for the latest in technology, online earning, programming tutorials, and entertainment. 
              Stay ahead with BlogFusion.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
          
          <div className="footer-links">
            <h4>Categories</h4>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}>{cat.name}</Link>
              ))
            ) : (
              <>
                <Link href="/category/technology">Technology</Link>
                <Link href="/category/online-earning">Online Earning</Link>
              </>
            )}
          </div>
          
          <div className="footer-links">
            <h4>Contact</h4>
            <p style={{ color: '#a8b2d1', fontSize: '0.9rem' }}>
              Email: huzaifamm70@gmail.com<br />
              Location: Pakistan
            </p>
            <EmailSubscription />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} BlogFusion. All rights reserved. 
            Designed for excellence by <a href="https://mhs-tech-alpha.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>MHS Tech</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
