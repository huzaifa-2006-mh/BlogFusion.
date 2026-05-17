'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/user');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>My Blogs</h1>
        <Link href="/dashboard/create" className="btn btn-primary">
          + Write New Blog
        </Link>
      </div>

      <div className="card" style={{ padding: '0', background: 'white', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your blogs...</div>
        ) : posts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Title</th>
                  <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Category</th>
                  <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Date</th>
                  <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Status</th>
                  <th style={{ padding: '1.2rem', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1.2rem', fontWeight: '600' }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'var(--primary-color)' }}>{post.title}</Link>
                    </td>
                    <td style={{ padding: '1.2rem' }}>{post.category?.name || 'Uncategorized'}</td>
                    <td style={{ padding: '1.2rem', color: '#888' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <span style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        background: post.published ? 'rgba(100, 255, 218, 0.1)' : '#eee',
                        color: post.published ? 'var(--secondary-color)' : '#888'
                      }}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem', display: 'flex', gap: '1rem' }}>
                      <Link href={`/dashboard/edit/${post.id}`} style={{ color: 'var(--primary-color)', fontWeight: '600', alignSelf: 'center' }}>Edit</Link>
                      
                      {/* FORM BASED DELETE - WORKS WITHOUT JS */}
                      <form action="/api/posts/delete-form" method="POST" onSubmit={() => confirm('Are you sure?')}>
                        <input type="hidden" name="id" value={post.id} />
                        <button 
                          type="submit"
                          style={{ 
                            background: '#ff4d4d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            padding: '0.4rem 0.8rem', 
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#888' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>You haven't written any blogs yet.</p>
            <Link href="/dashboard/create" className="btn btn-outline">Start Writing Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
