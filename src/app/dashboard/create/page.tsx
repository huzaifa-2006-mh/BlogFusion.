'use client';

import { useState, useEffect } from 'react';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      
      // Generate previews
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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('categoryId', categoryId);
      
      const contentWithSettings = `<post-settings size="${fontSize}" family="${fontFamily}" />\n` + content;
      formData.append('content', contentWithSettings);
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData, // Send as FormData for file uploads
      });

      if (response.ok) {
        alert('Blog published successfully! It will now appear on the website.');
        setTitle('');
        setContent('');
        setCategoryId('');
        setImageFiles([]);
        setPreviews([]);
      } else {
        const error = await response.json();
        alert(`Failed to publish blog: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred while publishing.');
    } finally {
      setIsLoading(false);
    }
  };

  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Inter');

  const insertTag = (tagType: 'bold' | 'link') => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (tagType === 'bold') {
      replacement = `<b>${selectedText || 'bold text'}</b>`;
    } else if (tagType === 'link') {
      const url = prompt('Enter the URL:', 'https://');
      if (url === null) return;
      replacement = `<back href="${url}">${selectedText || 'link text'}</back>`;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Focus back and set cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div>
      <h1 className="mb-4">Write a New Masterpiece</h1>
      
      <form onSubmit={handleSubmit} className="contact-form" style={{ background: 'white' }}>
        <div className="form-group">
          <label>Blog Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter a catchy title..." 
            required 
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Upload Images from Local PC</label>
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
              Add Photo
              <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Content</label>
          
          {/* Rich Text Toolbar */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            padding: '0.5rem', 
            background: '#f1f1f1', 
            border: '1px solid #ddd', 
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button type="button" onClick={() => insertTag('bold')} style={{ padding: '0.4rem 0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>B</button>
            <button type="button" onClick={() => insertTag('link')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>🔗 Link</button>
            
            <div style={{ borderLeft: '1px solid #ccc', height: '20px', margin: '0 0.5rem' }}></div>
            
            <label style={{ fontSize: '0.8rem' }}>Size:</label>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={{ padding: '0.2rem' }}>
              {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <label style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>Font:</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ padding: '0.2rem' }}>
              {['Inter', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Tahoma'].map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
            💡 Tip: Type <strong>[IMAGE]</strong> anywhere in your text to place one of your uploaded photos!
          </p>
          
          <textarea 
            id="blog-content-area"
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your blog content here..." 
            style={{ 
              minHeight: '400px', 
              borderRadius: '0 0 4px 4px',
              fontSize: fontSize,
              fontFamily: fontFamily
            }}
            required
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
