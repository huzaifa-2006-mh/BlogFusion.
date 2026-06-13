'use client';

import { useState, useEffect } from 'react';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function SubscribersDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscribers')
      .then((res) => res.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        Loading subscribers...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Email Subscribers</h1>
        <span style={{
          background: '#0f172a',
          color: '#64ffda',
          padding: '0.4rem 1rem',
          borderRadius: '100px',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>
          {subscribers.length} total
        </span>
      </div>

      {subscribers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
          <p style={{ fontWeight: 600 }}>No subscribers yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            The footer subscription form is live — share your blog!
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  #
                </th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Address
                </th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subscribed On
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, index) => (
                <tr
                  key={sub.id}
                  style={{
                    borderBottom: index < subscribers.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#1e293b' }}>
                    {sub.email}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
