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
    <div className="email-sub-box" style={{ marginTop: '1.5rem' }}>
      <p style={{ color: '#6B4226', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 650 }}>
        📬 Get our latest articles delivered to your inbox:
      </p>
      <form onSubmit={handleSubmit} className="email-sub-form" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          className="email-sub-input"
          style={{
            padding: '0.65rem 0.9rem',
            borderRadius: '9999px',
            border: '1px solid #E8DFD8',
            fontSize: '16px',
            flex: 1,
            minWidth: '200px',
            background: '#FFFFFF',
            color: '#222222',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="vip-btn-primary email-sub-btn"
          style={{
            padding: '0.65rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
        </button>
      </form>
      {status === 'error' && message && (
        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '600' }}>✕ {message}</p>
      )}
    </div>
  );
}
