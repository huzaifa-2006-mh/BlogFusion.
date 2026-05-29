'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogImageUploader from '@/components/BlogImageUploader';

interface FAQ {
  question: string;
  answer: string;
}

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnHome, setShowOnHome] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [isIndexable, setIsIndexable] = useState(true);
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
      setImageAlts(prev => [...prev, ...files.map((file) => file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => setPreviews(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageAlts(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageAlt = (index: number, value: string) => {
    setImageAlts((prev) => prev.map((alt, i) => (i === index ? value : alt)));
  };

  const addFAQ = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFAQ = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const insertTag = (tagType: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (tagType === 'h2') replacement = `# ${selectedText || 'Heading'}`;
    else if (tagType === 'h3') replacement = `## ${selectedText || 'Subheading'}`;
    else if (tagType === 'bold') replacement = `<b>${selectedText || 'bold text'}</b>`;
    else if (tagType === 'underline') replacement = `<u>${selectedText || 'underlined text'}</u>`;
    else if (tagType === 'link') {
      const url = prompt('Enter the URL:', 'https://');
      if (url === null) return;
      replacement = `<back href="${url}">${selectedText || 'link text'}</back>`;
    } else if (tagType === 'code') replacement = `<code>${selectedText || '// code here'}</code>`;
    else if (tagType === 'bullet-list') replacement = `<ul>\n  <li>${selectedText || 'Item'}</li>\n</ul>`;
    else if (tagType === 'space') replacement = `<spacer />`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertInlineStyle = (type: 'font-size' | 'font-family' | 'color' | 'background-color', value: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      alert('Please select some text first to apply the style.');
      return;
    }

    let replacement = '';
    if (type === 'font-size') {
      replacement = `<span style="font-size: ${value}px;">${selectedText}</span>`;
    } else if (type === 'font-family') {
      replacement = `<span style="font-family: ${value};">${selectedText}</span>`;
    } else if (type === 'color') {
      replacement = `<span style="color: ${value};">${selectedText}</span>`;
    } else if (type === 'background-color') {
      replacement = `<span style="background-color: ${value};">${selectedText}</span>`;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('shortDescription', shortDescription);
      formData.append('categoryId', categoryId);
      formData.append('showOnHome', String(showOnHome));
      formData.append('faqs', JSON.stringify(faqs));
      formData.append('content', content);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      formData.append('ogImage', ogImage);
      formData.append('canonicalUrl', canonicalUrl);
      formData.append('isIndexable', String(isIndexable));
      formData.append('imageAlts', JSON.stringify(imageAlts));
      imageFiles.forEach(file => formData.append('images', file));

      const response = await fetch('/api/posts', { method: 'POST', body: formData });

      if (response.ok) {
        alert('Blog published successfully!');
        router.push('/dashboard/posts');
      } else {
        alert('Failed to publish blog.');
      }
    } catch (error) {
      alert('An error occurred while publishing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Top Banner Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Create New Blog</h1>
            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Draft, polish, and publish a premium tech post onto Blog Fusion.</p>
        </div>
        <button 
          onClick={() => router.back()} 
          style={{ 
            padding: '0.6rem 1.2rem', 
            borderRadius: '8px', 
            border: '1px solid #cbd5e1', 
            background: 'white', 
            fontWeight: '700', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#334155',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="dashboard-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {/* Responsive Grid layout for Dashboard Forms */}
        <div className="responsive-editor-grid">
          
          {/* Left Column: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Core Blog Editor Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Blog Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Mastering the Art of Tech Guides..." 
                  style={{ 
                    width: '100%', 
                    padding: '1rem 1.2rem', 
                    fontSize: '1.35rem', 
                    fontWeight: '700', 
                    border: '1px solid #cbd5e1', 
                    background: '#f8fafc', 
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }} 
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0f172a';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.background = '#f8fafc';
                  }}
                  required 
                />
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Short Description</label>
                <input 
                  type="text" 
                  value={shortDescription} 
                  onChange={(e) => setShortDescription(e.target.value)} 
                  placeholder="A catchy, brief sub-title to hook home page readers..." 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Content</label>
                
                {/* Custom Rich Text Action Bar */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  alignItems: 'center',
                  marginBottom: '0.5rem', 
                  padding: '0.6rem', 
                  background: '#f1f5f9', 
                  borderRadius: '8px 8px 0 0', 
                  border: '1px solid #cbd5e1',
                  borderBottom: 'none'
                }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'H2', tag: 'h2', title: 'Large Heading' },
                      { label: 'H3', tag: 'h3', title: 'Small Heading' },
                      { label: 'B', tag: 'bold', title: 'Bold Text' },
                    { label: 'U', tag: 'underline', title: 'Underlined Text' },
                    { label: '🔗 Link', tag: 'link', title: 'Insert Backlink' },
                    { label: '💻 Code', tag: 'code', title: 'Insert Code Block' },
                    { label: '• List', tag: 'bullet-list', title: 'Unordered List' },
                    { label: '↕ Space', tag: 'space', title: 'Insert Vertical Space' }
                  ].map((btn) => (
                    <button 
                      key={btn.tag}
                      type="button" 
                      onClick={() => insertTag(btn.tag)} 
                      title={btn.title}
                      style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '6px', 
                        border: '1px solid #cbd5e1', 
                        background: 'white', 
                        cursor: 'pointer', 
                        fontWeight: btn.tag === 'bold' ? 'bold' : 'normal',
                        textDecoration: btn.tag === 'underline' ? 'underline' : 'none',
                        fontSize: '0.85rem',
                        color: '#334155',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.borderColor = '#0f172a';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', cursor: 'pointer', background: 'white', border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '6px' }} title="Text Color">
                      <span style={{ fontWeight: 'bold', color: '#ff4b91' }}>A</span>
                      <input type="color" onChange={(e) => insertInlineStyle('color', e.target.value)} style={{ padding: '0', border: 'none', width: '24px', height: '24px', cursor: 'pointer', background: 'transparent' }} />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', cursor: 'pointer', background: 'white', border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '6px' }} title="Highlight Background Color">
                      <span style={{ fontWeight: 'bold', background: '#fef08a', padding: '0 2px' }}>A</span>
                      <input type="color" defaultValue="#fef08a" onChange={(e) => insertInlineStyle('background-color', e.target.value)} style={{ padding: '0', border: 'none', width: '24px', height: '24px', cursor: 'pointer', background: 'transparent' }} />
                    </label>
                    <select value="" onChange={(e) => { if(e.target.value) insertInlineStyle('font-family', e.target.value) }} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}>
                      <option value="">Font Style</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Times New Roman', serif">Times New Roman</option>
                      <option value="'Courier New', monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Verdana, sans-serif">Verdana</option>
                      <option value="Tahoma, sans-serif">Tahoma</option>
                      <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                      <option value="Impact, sans-serif">Impact</option>
                      <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                    </select>
                    <select value="" onChange={(e) => { if(e.target.value) insertInlineStyle('font-size', e.target.value) }} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}>
                      <option value="">Size</option>
                      {[12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea 
                  id="blog-content-area"
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Start writing your premium tech guide here..." 
                  style={{ 
                    width: '100%', 
                    minHeight: '450px', 
                    padding: '1.2rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '0 0 10px 10px', 
                    lineHeight: '1.75', 
                    fontSize: '1.05rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  required
                ></textarea>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>💡 Tip: Use `[IMAGE: Your Alt Text]` to embed uploaded images inline with alt text.</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Supports robust HTML formatting tags</span>
                </div>
              </div>
            </div>

            {/* SEO Settings Card */}
            <div style={{ 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' 
            }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '900', fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>SEO & Search Engine Metadata</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Configure tags to optimize your post visibility on Google.</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Meta Title</label>
                <input 
                  type="text" 
                  value={metaTitle} 
                  onChange={(e) => setMetaTitle(e.target.value)} 
                  placeholder="SEO Title (defaults to blog title if left empty)" 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Meta Description</label>
                <textarea 
                  value={metaDescription} 
                  onChange={(e) => setMetaDescription(e.target.value)} 
                  placeholder="Summarize the post for Google search results (recommended length: 150-160 characters)..." 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px', 
                    minHeight: '80px', 
                    outline: 'none',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                ></textarea>
              </div>

              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Focus Keywords</label>
                <input
                  type="text"
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                  placeholder="e.g. next.js seo, blog optimization, image alt text"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>OG Image URL</label>
                <input 
                  type="text" 
                  value={ogImage} 
                  onChange={(e) => setOgImage(e.target.value)} 
                  placeholder="https://example.com/og-image.jpg" 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block', letterSpacing: '0.05em' }}>Canonical URL (Optional)</label>
                <input 
                  type="text" 
                  value={canonicalUrl} 
                  onChange={(e) => setCanonicalUrl(e.target.value)} 
                  placeholder="Leave blank to use default URL" 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem 1rem', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: '#334155'
                }}>
                  <input 
                    type="checkbox" 
                    checked={isIndexable} 
                    onChange={(e) => setIsIndexable(e.target.checked)} 
                    style={{ width: '1.15rem', height: '1.15rem', cursor: 'pointer' }} 
                  />
                  Index this page (Allow Search Engines)
                </label>
              </div>
            </div>

            {/* Premium FAQ Card Section */}
            <div style={{ 
              background: 'white', 
              padding: '2.5rem', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontWeight: '900', fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em', margin: '0' }}>FAQs Section</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Add answers to commonly asked questions about this guide.</p>
                </div>
                <button 
                  type="button" 
                  onClick={addFAQ} 
                  style={{ 
                    color: '#ff4b91', 
                    fontWeight: '800', 
                    background: 'rgba(255,75,145,0.05)', 
                    border: '1px solid rgba(255,75,145,0.2)', 
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,75,145,0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,75,145,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  + Add FAQ
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: '1.25rem', 
                      background: '#f8fafc', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem'
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={() => removeFAQ(index)} 
                      title="Remove FAQ"
                      style={{ 
                        position: 'absolute', 
                        top: '0.75rem', 
                        right: '0.75rem', 
                        color: '#64748b',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                      ✕
                    </button>

                    <div style={{ width: '92%' }}>
                      <input 
                        type="text" 
                        placeholder="FAQ Question..." 
                        value={faq.question} 
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)} 
                        style={{ 
                          fontWeight: '700', 
                          border: 'none', 
                          borderBottom: '1px solid #e2e8f0', 
                          background: 'transparent', 
                          width: '100%',
                          fontSize: '0.95rem',
                          paddingBottom: '0.3rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <textarea 
                      placeholder="FAQ Answer Detail..." 
                      value={faq.answer} 
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)} 
                      style={{ 
                        width: '100%', 
                        border: 'none', 
                        background: 'transparent', 
                        minHeight: '60px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>
                ))}

                {faqs.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '10px' }}>
                    No FAQs added. Click "+ Add FAQ" above to add interactive answers.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Settings Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Publisher Box */}
            <div className="dashboard-card" style={{ padding: '2rem' }}>
              <h4 style={{ margin: '0 0 1.2rem 0', fontWeight: '900', fontSize: '1.1rem', color: '#0f172a' }}>Publish Settings</h4>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Category</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: '600',
                    color: '#334155',
                    background: '#f8fafc',
                    cursor: 'pointer'
                  }} 
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: '#334155'
                }}>
                  <input 
                    type="checkbox" 
                    checked={showOnHome} 
                    onChange={(e) => setShowOnHome(e.target.checked)} 
                    style={{ width: '1.15rem', height: '1.15rem', cursor: 'pointer' }} 
                  />
                  Show on Home Page
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                style={{ 
                  width: '100%', 
                  padding: '0.85rem', 
                  background: '#0f172a', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '700', 
                  fontSize: '1rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(15,23,42,0.15)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                {isLoading ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>

            {/* Media Upload Card */}
            <div className="dashboard-card" style={{ padding: '2rem' }}>
              <BlogImageUploader
                previews={previews}
                imageAlts={imageAlts}
                onImagesChange={handleImageChange}
                onAltChange={updateImageAlt}
                onRemove={removeImage}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
