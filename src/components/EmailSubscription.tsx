'use client';

import { useState, useEffect } from 'react';

export default function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('bf_subscribed_email');
    if (savedEmail) {
      setStatus('success');
      setMessage('You are already subscribed! ✓');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to subscribe.');

      localStorage.setItem('bf_subscribed_email', email);
      setStatus('success');
      setMessage(data.message || 'Successfully subscribed! 🎉');
      setEmail('');

      // Also ping analytics to link email
      const vid = localStorage.getItem('blog_visitor_id');
      if (vid) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: vid, path: window.location.pathname, email }),
        }).catch(() => {});
      }
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ marginTop: '1rem' }}>
        <p style={{ color: '#64ffda', fontSize: '0.9rem', fontWeight: 600 }}>✓ {message}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: '#a8b2d1', fontSize: '0.9rem', marginBottom: '0.6rem', fontWeight: 500 }}>
        📬 Get latest articles in your inbox:
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          style={{
            padding: '0.55rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(100,255,218,0.2)',
            fontSize: '0.9rem',
            flex: 1,
            minWidth: '180px',
            background: 'rgba(255,255,255,0.05)',
            color: '#ccd6f6',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          style={{
            padding: '0.55rem 1.2rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            background: status === 'loading' ? 'rgba(100,255,218,0.4)' : '#64ffda',
            color: '#0a192f',
            fontWeight: 700,
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && message && (
        <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.4rem' }}>{message}</p>
      )}
    </div>
  );
}
