import Link from 'next/link';

const Navbar = () => {
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
          <Link href="/category">Topics</Link>
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
