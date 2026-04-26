'use client';

import { useState, useEffect } from 'react';

export default function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email');
    if (savedEmail) {
      setSubmitted(true);
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    localStorage.setItem('user_email', email);
    setSubmitted(true);

    // Ping analytics to link email to current session
    const vid = localStorage.getItem('blog_visitor_id');
    if (vid) {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: vid,
            path: window.location.pathname,
            email: email
          })
        });
      } catch (err) {
        // Silent fail
      }
    }
  };

  if (submitted) {
    return (
      <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', marginTop: '1rem' }}>
        ✓ Thanks for subscribing!
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: '#a8b2d1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Get latest updates:</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: 'none',
            fontSize: '0.9rem',
            width: '100%',
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            background: 'var(--secondary-color)',
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Join
        </button>
      </form>
    </div>
  );
}
