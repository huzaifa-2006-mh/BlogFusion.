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
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/posts/${id}`)
        ]);
        
        const catData = await catRes.json();
        const postData = await postRes.json();
        
        if (postData) {
          setCategories(catData);
          setTitle(postData.title || '');
          setCategoryId(postData.categoryId || '');
          setMetaTitle(postData.metaTitle || '');
          setMetaDescription(postData.metaDescription || '');
          setFocusKeywords(postData.focusKeywords || '');
          
          let rawContent = postData.content || '';
          const fontSettingsMatch = rawContent.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
          if (fontSettingsMatch) {
            setFontSize(fontSettingsMatch[1]);
            setFontFamily(fontSettingsMatch[2]);
            rawContent = rawContent.replace(/<post-settings .*? \/>\n?/, '');
          }
          setContent(rawContent);
          
          if (postData.images) {
            setPreviews(postData.images);
          }
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
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      
      const contentWithSettings = `<post-settings size="${fontSize}" family="${fontFamily}" />\n` + content;
      formData.append('content', contentWithSettings);
      
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

  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Inter');

  const [textColor, setTextColor] = useState('#000000');

  const insertTag = (tagType: 'bold' | 'link' | 'color' | 'underline' | 'no-underline') => {
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
    } else if (tagType === 'color') {
      replacement = `<color val="${textColor}">${selectedText || 'colored text'}</color>`;
    } else if (tagType === 'underline') {
      replacement = `<u>${selectedText || 'underlined text'}</u>`;
    } else if (tagType === 'no-underline') {
      replacement = `<no-u>${selectedText || 'non-underlined text'}</no-u>`;
    } else if (tagType === 'code') {
      replacement = `<code>${selectedText || '// write your code here'}</code>`;
    } else if (tagType === 'bullet-list') {
      replacement = `<ul>\n  <li>${selectedText || 'Item 1'}</li>\n  <li>Item 2</li>\n</ul>`;
    } else if (tagType === 'number-list') {
      replacement = `<ol>\n  <li>${selectedText || 'Item 1'}</li>\n  <li>Item 2</li>\n</ol>`;
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
            <button type="button" onClick={() => insertTag('underline')} style={{ padding: '0.4rem 0.8rem', textDecoration: 'underline', cursor: 'pointer' }}>U</button>
            <button type="button" onClick={() => insertTag('no-underline')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', position: 'relative' }}>
              U <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', width: '100%', height: '1px', background: 'red' }}></span>
            </button>
            <button type="button" onClick={() => insertTag('link')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>🔗 Link</button>
            <button type="button" onClick={() => insertTag('code')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>💻 Code</button>
            <button type="button" onClick={() => insertTag('bullet-list')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>• List</button>
            <button type="button" onClick={() => insertTag('number-list')} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>1. List</button>
            
            <div style={{ borderLeft: '1px solid #ccc', height: '20px', margin: '0 0.5rem' }}></div>
            
            <label style={{ fontSize: '0.8rem' }}>Color:</label>
            <input 
              type="color" 
              value={textColor} 
              onChange={(e) => setTextColor(e.target.value)} 
              style={{ padding: '0', width: '30px', height: '25px', cursor: 'pointer', border: '1px solid #ccc' }} 
            />
            <button type="button" onClick={() => insertTag('color')} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>Apply Color</button>

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

          <div className="code-instruction">
            <strong>How to write code:</strong> Highlight your code and click the <strong>💻 Code</strong> button, or wrap your code manually in <code>&lt;code&gt;...&lt;/code&gt;</code> tags.
          </div>

          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
            💡 Tip: Use <strong>[IMAGE]</strong> to place your uploaded photos inside the text.
          </p>
          
          <textarea 
            id="blog-content-area"
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your heart out..."
            style={{ 
              minHeight: '400px', 
              padding: '1rem', 
              border: '1px solid #eee', 
              borderRadius: '0 0 8px 8px', 
              fontSize: fontSize,
              fontFamily: fontFamily
            }}
            required
          ></textarea>
        </div>

        {/* SEO Settings Section */}
        <div className="form-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>SEO Settings</h3>
          
          <div className="form-group">
            <label>Meta Title</label>
            <input 
              type="text" 
              value={metaTitle} 
              onChange={(e) => setMetaTitle(e.target.value)} 
              placeholder="SEO Title (leave blank to use blog title)" 
              style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group">
            <label>Meta Description</label>
            <textarea 
              value={metaDescription} 
              onChange={(e) => setMetaDescription(e.target.value)} 
              placeholder="Brief summary for search engines..." 
              style={{ minHeight: '100px', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Focus Keywords</label>
            <input 
              type="text" 
              value={focusKeywords} 
              onChange={(e) => setFocusKeywords(e.target.value)} 
              placeholder="e.g. technology, health, coding (comma separated)" 
              style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}
            />
          </div>
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
