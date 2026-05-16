'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [showOnHome, setShowOnHome] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('categoryId', categoryId);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      formData.append('showOnHome', String(showOnHome));
      formData.append('shortDescription', shortDescription);
      formData.append('faqs', JSON.stringify(faqs));
      
      const contentWithSettings = `<post-settings size="${fontSize}" family="${fontFamily}" />\n` + content;
      formData.append('content', contentWithSettings);
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Blog published successfully!');
        setTitle('');
        setContent('');
        setCategoryId('');
        setMetaTitle('');
        setMetaDescription('');
        setFocusKeywords('');
        setImageFiles([]);
        setPreviews([]);
        setShowOnHome(true);
        setShortDescription('');
        setFaqs([]);
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
  const [textColor, setTextColor] = useState('#000000');

  const insertTag = (tagType: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (tagType === 'bold') replacement = `<b>${selectedText || 'bold text'}</b>`;
    else if (tagType === 'link') {
      const url = prompt('Enter the URL:', 'https://');
      if (url === null) return;
      replacement = `<back href="${url}">${selectedText || 'link text'}</back>`;
    } else if (tagType === 'color') replacement = `<color val="${textColor}">${selectedText || 'colored text'}</color>`;
    else if (tagType === 'underline') replacement = `<u>${selectedText || 'underlined text'}</u>`;
    else if (tagType === 'no-underline') replacement = `<no-u>${selectedText || 'non-underlined text'}</no-u>`;
    else if (tagType === 'code') replacement = `<code>${selectedText || '// write your code here'}</code>`;
    else if (tagType === 'bullet-list') replacement = `<ul>\n  <li>${selectedText || 'Item 1'}</li>\n  <li>Item 2</li>\n</ul>`;
    else if (tagType === 'number-list') replacement = `<ol>\n  <li>${selectedText || 'Item 1'}</li>\n  <li>Item 2</li>\n</ol>`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a catchy title..." required />
        </div>

        <div className="form-group">
          <label>Short Description (Sub-title)</label>
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief catchphrase for the home page..." />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} style={{ width: 'auto' }} />
            Show on Home Page
          </label>
        </div>

        <div className="form-group">
          <label>Upload Images</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {previews.map((preview, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={preview} alt="preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>x</button>
              </div>
            ))}
            <label style={{ width: '120px', height: '120px', border: '2px dashed #ccc', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              <span style={{ fontSize: '1.5rem' }}>+</span>
              Add Photo
              <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Content</label>
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: '#f1f1f1', border: '1px solid #ddd', borderRadius: '4px 4px 0 0', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="button" onClick={() => insertTag('bold')} style={{ padding: '0.4rem 0.8rem', fontWeight: 'bold' }}>B</button>
            <button type="button" onClick={() => insertTag('underline')} style={{ padding: '0.4rem 0.8rem', textDecoration: 'underline' }}>U</button>
            <button type="button" onClick={() => insertTag('link')} style={{ padding: '0.4rem 0.8rem' }}>🔗 Link</button>
            <button type="button" onClick={() => insertTag('code')} style={{ padding: '0.4rem 0.8rem' }}>💻 Code</button>
            <button type="button" onClick={() => insertTag('bullet-list')} style={{ padding: '0.4rem 0.8rem' }}>• List</button>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '30px', height: '25px' }} />
            <button type="button" onClick={() => insertTag('color')} style={{ fontSize: '0.8rem' }}>Apply Color</button>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              {['12px', '14px', '16px', '18px', '20px', '24px', '32px'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <textarea id="blog-content-area" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog content here..." style={{ minHeight: '400px', fontSize, fontFamily }} required></textarea>
        </div>

        {/* FAQ Section */}
        <div className="form-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '1rem' }}>Frequently Asked Questions (FAQs)</h3>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #f1f1f1', borderRadius: '8px', position: 'relative' }}>
                <button type="button" onClick={() => removeFAQ(index)} style={{ position: 'absolute', top: '10px', right: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                <input 
                    type="text" 
                    placeholder="Question" 
                    value={faq.question} 
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)} 
                    style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}
                />
                <textarea 
                    placeholder="Answer" 
                    value={faq.answer} 
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)} 
                    style={{ minHeight: '80px' }}
                ></textarea>
            </div>
          ))}
          <button type="button" onClick={addFAQ} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>+ Add FAQ</button>
        </div>
        
        <div className="form-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>SEO Settings</h3>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="SEO Title" style={{ marginBottom: '1rem' }} />
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="SEO Description" style={{ minHeight: '100px' }}></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Publishing...' : 'Publish Post'}</button>
      </form>
    </div>
  );
}
