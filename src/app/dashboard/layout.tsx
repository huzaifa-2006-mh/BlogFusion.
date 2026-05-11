'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('auth_session='));
    if (session) {
      setUsername(session.split('=')[1]);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-container">
      <button className="mobile-nav-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '✖' : '☰'}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Link href="/" className="logo-link">
          <div className="logo-container" style={{ marginBottom: '2rem' }}>
            <img src="/logo.png" alt="BlogFusion" className="logo-img" />
            <span className="logo-fallback">BlogFusion<span className="highlight">.</span></span>
          </div>
        </Link>
        
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '2rem' }}>
          <p style={{ color: '#8892b0', fontSize: '0.8rem' }}>Logged in as</p>
          <p style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{username}</p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            📊 Overview
          </Link>
          <Link href="/dashboard/create" className={pathname === '/dashboard/create' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            ✍️ Write Blog
          </Link>
          <Link href="/dashboard/posts" className={pathname === '/dashboard/posts' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            📚 My Blogs
          </Link>
          <Link href="/dashboard/categories" className={pathname === '/dashboard/categories' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            📁 Categories
          </Link>
          <Link href="/dashboard/settings" className={pathname === '/dashboard/settings' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            ⚙️ Settings
          </Link>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#ff4d4d', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem', 
              width: '100%',
              cursor: 'pointer',
              marginTop: 'auto'
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1001
          }}
        />
      )}
    </div>
  );
}
