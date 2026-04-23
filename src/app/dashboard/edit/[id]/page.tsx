'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/posts/${id}`)
        ]);
        
        const catData = await catRes.json();
        const postData = await postRes.json();
        
        setCategories(catData);
        setTitle(postData.title);
        setCategoryId(postData.categoryId);
        setContent(postData.content);
        if (postData.images) {
          setPreviews(postData.images);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    // If it's a new file, remove from imageFiles too
    // This is tricky because previews includes both old URLs and new DataURLs
    // For simplicity, we'll just clear new files if any removal happens 
    // or let the user know they are replacing all images if they upload new ones.
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles([]); // Reset files to force re-selection if they want to edit further
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('categoryId', categoryId);
      formData.append('content', content);
      
      // If no new files, the API will keep existing ones (based on our PATCH logic)
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        alert('Blog updated successfully!');
        router.push('/dashboard/posts');
      } else {
        alert('Failed to update blog.');
      }
    } catch (error) {
      alert('An error occurred while updating.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading post data...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Edit Blog</h1>
        <button onClick={() => router.back()} className="btn btn-outline">Back to List</button>
      </div>
      
      <form onSubmit={handleSubmit} className="contact-form" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div className="form-group">
          <label style={{ fontWeight: '600' }}>Blog Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter blog title"
            style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}
            required 
          />
        </div>

        <div className="form-group">
          <label style={{ fontWeight: '600' }}>Category</label>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label style={{ fontWeight: '600' }}>Images</label>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
            Uploading new images will replace the current ones.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {previews.map((preview, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={preview} alt="preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                <button 
                  type="button" 
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                >x</button>
              </div>
            ))}
            <label style={{ 
              width: '120px', 
              height: '120px', 
              border: '2px dashed #ccc', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '0.8rem'
            }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>+</span>
              New Photo
              <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label style={{ fontWeight: '600' }}>Content</label>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            💡 Tip: Use <strong>[IMAGE]</strong> to place your uploaded photos inside the text.
          </p>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your heart out..."
            style={{ minHeight: '400px', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', fontSize: '1.1rem' }}
            required
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }} disabled={isUpdating}>
            {isUpdating ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
