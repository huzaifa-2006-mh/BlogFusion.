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
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Link href="/" className="logo-link">
          <div className="logo-container" style={{ marginBottom: '2.5rem' }}>
            <span className="logo-fallback" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Blog Fusion<span style={{ color: '#ff4b91' }}>.</span>
            </span>
          </div>
        </Link>
        
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Admin</p>
          <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{username || 'Huzaifa'}</p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
             Overview
          </Link>
          <Link href="/dashboard/create" className={pathname === '/dashboard/create' ? 'active' : ''}>
             Write Blog
          </Link>
          <Link href="/dashboard/posts" className={pathname === '/dashboard/posts' ? 'active' : ''}>
             My Blogs
          </Link>
          <Link href="/dashboard/categories" className={pathname === '/dashboard/categories' ? 'active' : ''}>
             Categories
          </Link>
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button 
              onClick={handleLogout}
              style={{ color: '#ef4444' }}
            >
              Logout
            </button>
          </div>
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
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }}
        />
      )}
    </div>
  );
}
