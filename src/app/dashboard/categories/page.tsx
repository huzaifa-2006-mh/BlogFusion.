'use client';

import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string, name: string, slug: string, showOnHome: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleHomeVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnHome: !currentStatus })
      });
      if (res.ok) {
        setCategories(categories.map(cat => cat.id === id ? { ...cat, showOnHome: !currentStatus } : cat));
      }
    } catch (error) {
      alert('Failed to update category visibility.');
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading categories...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Manage Categories</h1>
      
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Category Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Slug</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Show on Home Page</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{cat.name}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{cat.slug}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={cat.showOnHome} 
                        onChange={() => toggleHomeVisibility(cat.id, cat.showOnHome)}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                    />
                    {cat.showOnHome ? 'Visible' : 'Hidden'}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
