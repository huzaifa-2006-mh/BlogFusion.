import Link from 'next/link';
import prisma from '@/lib/prisma';

const Navbar = async () => {
  // Fetch categories from database
  let categories = [];
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
        <Link href="/" className="logo">
          BlogFusion<span className="highlight">.</span>
        </Link>
        
        {/* Mobile Menu Toggle (Simplified) */}
        <input type="checkbox" id="nav-toggle" style={{ display: 'none' }} />
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>

        <nav className="nav-links">
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
