import Link from 'next/link';
import prisma from '@/lib/prisma';

const Navbar = async () => {
  // Fetch categories from database
  let categories: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    categories = await prisma.category.findMany();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Fallback categories if DB fails
    categories = [
      { name: 'Technology', slug: 'technology' },
      { name: 'Online Earning', slug: 'online-earning' },
    ];
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo-link">
          <div className="logo-container">
            <img src="/logo.png" alt="BlogFusion" className="logo-img" />
            <span className="logo-fallback">BlogFusion<span className="highlight">.</span></span>
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
          <div className="dropdown">
            <span className="dropdown-toggle">Categories ▾</span>
            <div className="dropdown-menu">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/dashboard" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
