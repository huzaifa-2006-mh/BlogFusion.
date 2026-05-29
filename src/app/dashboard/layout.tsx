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
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('auth_session='));
    if (session) {
      setUsername(session.split('=')[1]);
      
      // Fetch user profile for image
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data && data.image) {
            setUserImage(data.image);
          }
        })
        .catch(err => console.error('Failed to fetch user profile:', err));
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-container">
      {/* Mobile Top Header Bar */}
      <header className="dashboard-mobile-header">
        <Link href="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="Blog Fusion" width={32} height={32} style={{ borderRadius: '6px' }} />
          <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
            Blog<span style={{ color: '#e11d48' }}>Fusion</span>
          </span>
        </Link>
        <button className="dashboard-mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Navigation">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link href="/" className="logo-link" onClick={() => setIsSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="Blog Fusion" width={36} height={36} style={{ borderRadius: '6px' }} />
            <div className="logo-container">
              <span className="logo-text" style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Blog<span style={{ color: '#e11d48' }}>Fusion</span>
              </span>
            </div>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close Navigation">
            ✕
          </button>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {userImage ? (
              <img src={userImage} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              username ? username[0].toUpperCase() : 'A'
            )}
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Admin</p>
            <p style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>{username || 'Huzaifa'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             Overview
          </Link>
          <Link href="/dashboard/create" className={pathname === '/dashboard/create' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             Write Blog
          </Link>
          <Link href="/dashboard/posts" className={pathname === '/dashboard/posts' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             My Blogs
          </Link>
          <Link href="/dashboard/categories" className={pathname === '/dashboard/categories' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             Categories
          </Link>
          <Link href="/dashboard/seo" className={pathname === '/dashboard/seo' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             SEO Settings
          </Link>
          <Link href="/dashboard/settings" className={pathname === '/dashboard/settings' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
             Settings
          </Link>
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button 
              onClick={() => {
                setIsSidebarOpen(false);
                handleLogout();
              }}
              style={{ color: '#ef4444', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}
