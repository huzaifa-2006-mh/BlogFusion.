'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PAGES = [
  { label: 'Home Page', path: '/' },
  { label: 'About Page', path: '/about' },
  { label: 'Contact Page', path: '/contact' },
  { label: 'Categories Page', path: '/category' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  { label: 'Disclaimer', path: '/disclaimer' },
  { label: 'FAQs Page', path: '/faqs' },
];

export default function SeoDashboard() {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState(PAGES[0].path);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    focusKeywords: '',
    ogImage: '',
    canonicalUrl: '',
    isIndexable: true,
  });

  useEffect(() => {
    const fetchSeoData = async () => {
      setLoading(true);
      setMessage({ text: '', type: '' });
      try {
        const res = await fetch(`/api/seo?pagePath=${encodeURIComponent(selectedPage)}`);
        const data = await res.json();
        if (data.seo) {
          setFormData({
            metaTitle: data.seo.metaTitle || '',
            metaDescription: data.seo.metaDescription || '',
            focusKeywords: data.seo.focusKeywords || '',
            ogImage: data.seo.ogImage || '',
            canonicalUrl: data.seo.canonicalUrl || '',
            isIndexable: data.seo.isIndexable ?? true,
          });
        } else {
          setFormData({
            metaTitle: '',
            metaDescription: '',
            focusKeywords: '',
            ogImage: '',
            canonicalUrl: '',
            isIndexable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [selectedPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath: selectedPage,
          ...formData,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'SEO settings saved successfully!', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: data.error || 'Failed to save SEO settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>Global SEO Management</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Manage meta tags, indexing, and open graph data for your static pages.</p>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
            Select Page to Optimize
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', backgroundColor: '#f8fafc' }}
          >
            {PAGES.map(page => (
              <option key={page.path} value={page.path}>{page.label} ({page.path})</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>Loading SEO data...</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="e.g. Best Tech Blog in 2026 - Blog Fusion"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.3rem' }}>Recommended length: 50-60 characters.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Discover the latest tech news, programming tutorials, and earning tips..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
              ></textarea>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.3rem' }}>Recommended length: 150-160 characters.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Focus Keywords
              </label>
              <input
                type="text"
                name="focusKeywords"
                value={formData.focusKeywords}
                onChange={handleChange}
                placeholder="e.g. tech blog, online earning, tutorials (comma separated)"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                OpenGraph Image URL (Social Media Preview)
              </label>
              <input
                type="text"
                name="ogImage"
                value={formData.ogImage}
                onChange={handleChange}
                placeholder="https://yourdomain.com/og-image.jpg"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                Canonical URL (Optional)
              </label>
              <input
                type="text"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
                placeholder="e.g. https://blog-fusion-beta.vercel.app/"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.3rem' }}>Leave blank to use the default URL.</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
              <input
                type="checkbox"
                id="isIndexable"
                name="isIndexable"
                checked={formData.isIndexable}
                onChange={handleChange}
                style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
              />
              <div>
                <label htmlFor="isIndexable" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                  Allow Search Engines to Index this Page
                </label>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>If unchecked, a "noindex, nofollow" tag will be added to hide it from Google.</p>
              </div>
            </div>

            {message.text && (
              <div style={{ padding: '1rem', borderRadius: '6px', backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', fontWeight: '500' }}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', alignSelf: 'flex-start' }}
            >
              {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
