'use client';

import { useState, useEffect } from 'react';

export default function ManageCategories() {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [categories, setCategories] = useState<{ id: string, name: string, slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setName('');
        fetchCategories();
        alert('Category added successfully!');
      }
    } catch (error) {
      alert('Error adding category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, name: editingName }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
        alert('Category updated!');
      }
    } catch (error) {
      alert('Error updating category');
    } finally {
      setIsUpdating(false);
    }
  };

  const startEditing = (cat: { id: string, name: string }) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete the category.')) return;
    
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
        alert('Category deleted!');
      } else {
        alert('Could not delete category. It might be linked to blogs.');
      }
    } catch (error) {
      alert('Error deleting category');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Manage Categories</h1>
      
      <div className="card" style={{ padding: '2rem', background: 'white', marginBottom: '3rem' }}>
        <h3>Add New Category</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Category Name (e.g. Health)" 
            style={{ flex: 1, padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: '0', background: 'white', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Name</th>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Slug</th>
              <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1.2rem', fontWeight: '600' }}>
                    {editingId === cat.id ? (
                      <input 
                        type="text" 
                        value={editingName} 
                        onChange={(e) => setEditingName(e.target.value)}
                        style={{ padding: '0.4rem', border: '1px solid var(--primary-color)', borderRadius: '4px', width: '100%' }}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td style={{ padding: '1.2rem' }}>{cat.slug}</td>
                  <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                    {editingId === cat.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} disabled={isUpdating}>Save</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => startEditing(cat)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
                        >Edit</button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: '600' }}
                        >Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No categories found. Add your first one above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
