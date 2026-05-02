import Link from 'next/link';
import prisma from '@/lib/prisma';

const Footer = async () => {
  let categories: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    categories = await prisma.category.findMany({ take: 6 });
  } catch (error) {
    categories = [];
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <Link href="/" className="footer-logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="BlogFusion Logo" style={{ height: '40px', width: 'auto' }} />
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
          <p>&copy; {new Date().getFullYear()} BlogFusion. All rights reserved. Designed for excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
