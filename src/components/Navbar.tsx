import Link from 'next/link';
import prisma from '@/lib/prisma';

const Navbar = async () => {
  // Fetch categories from database
  let categories: any[] = [];
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
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="BlogFusion Logo" style={{ height: '40px', width: 'auto', marginRight: '10px' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'block'; }} />
          <span style={{ display: 'none' }}>BlogFusion<span className="highlight">.</span></span>
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
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', function() {
            var links = document.querySelectorAll('.nav-links a');
            var toggle = document.getElementById('nav-toggle');
            links.forEach(function(link) {
              link.addEventListener('click', function() {
                if (toggle) toggle.checked = false;
              });
            });
          });
        `}} />
      </div>
    </header>
  );
};

export default Navbar;
