'use client';

import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string, name: string, slug: string, showOnHome: boolean, description?: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newCategoryName.trim(), 
          description: newCategoryDescription.trim() 
        })
      });

      if (res.ok) {
        const createdCat = await res.json();
        setCategories([...categories, createdCat].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCategoryName('');
        setNewCategoryDescription('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to create category.');
      }
    } catch (error) {
      alert('Failed to create category.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will delete the category but not necessarily the blogs. (They will be uncategorized)')) {
      return;
    }

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to delete category.');
      }
    } catch (error) {
      alert('Failed to delete category.');
    }
  };

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
      
      {/* Create Category Section */}
      <div className="dashboard-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>Create New Category</h2>
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Category Name</label>
              <input 
                type="text"
                placeholder="e.g. Python, Machine Learning"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <div style={{ flex: '2', minWidth: '350px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Category Description (Subtext)</label>
              <input 
                type="text"
                placeholder="e.g. Tips and tutorials for Python"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isCreating}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0f172a',
              color: 'white',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'background-color 0.2s',
              alignSelf: 'flex-start',
              minWidth: '150px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
          >
            {isCreating ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      {/* Categories Table Section */}
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Category Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Description</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Slug</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Show on Home Page</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{cat.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>{cat.description || '—'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{cat.slug}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={cat.showOnHome} 
                        onChange={() => toggleHomeVisibility(cat.id, cat.showOnHome)}
                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: cat.showOnHome ? '#0f172a' : '#64748b', fontWeight: cat.showOnHome ? '600' : 'normal' }}>
                        {cat.showOnHome ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
