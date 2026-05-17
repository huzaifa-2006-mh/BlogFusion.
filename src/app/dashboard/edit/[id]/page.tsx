'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface FAQ {
  question: string;
  answer: string;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOnHome, setShowOnHome] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

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
          setShowOnHome(postData.showOnHome ?? true);
          setShortDescription(postData.shortDescription || '');
          setFaqs(postData.faqs || []);
          setMetaTitle(postData.metaTitle || '');
          setMetaDescription(postData.metaDescription || '');
          
          let rawContent = postData.content || '';
          const fontSettingsMatch = rawContent.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
          if (fontSettingsMatch) {
            rawContent = rawContent.replace(/<post-settings .*? \/>\n?/, '');
          }
          setContent(rawContent);
          
          if (postData.images) setPreviews(postData.images);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const insertTag = (tagType: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (tagType === 'bold') replacement = `<b>${selectedText || 'bold text'}</b>`;
    else if (tagType === 'underline') replacement = `<u>${selectedText || 'underlined text'}</u>`;
    else if (tagType === 'link') {
      const url = prompt('Enter the URL:', 'https://');
      if (url === null) return;
      replacement = `<back href="${url}">${selectedText || 'link text'}</back>`;
    } else if (tagType === 'code') replacement = `<code>${selectedText || '// code here'}</code>`;
    else if (tagType === 'bullet-list') replacement = `<ul>\n  <li>${selectedText || 'Item'}</li>\n</ul>`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => setPreviews(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles([]); 
  };

  const addFAQ = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFAQ = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
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
      imageFiles.forEach(file => formData.append('images', file));

      const response = await fetch(`/api/posts/${id}`, { method: 'PATCH', body: formData });

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Edit Blog</h1>
            <p style={{ color: '#64748b' }}>Update your post and refine its content.</p>
        </div>
        <button onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Back</button>
      </div>
      
      <form onSubmit={handleSubmit} className="dashboard-form-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Blog Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', fontWeight: '700', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Short Description</label>
                    <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                </div>
                <div>
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Content</label>
                    
                    {/* Toolbar Re-added */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <button type="button" onClick={() => insertTag('bold')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>B</button>
                        <button type="button" onClick={() => insertTag('underline')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', textDecoration: 'underline' }}>U</button>
                        <button type="button" onClick={() => insertTag('link')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>🔗 Link</button>
                        <button type="button" onClick={() => insertTag('code')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>💻 Code</button>
                        <button type="button" onClick={() => insertTag('bullet-list')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>• List</button>
                    </div>

                    <textarea id="blog-content-area" value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', minHeight: '500px', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', lineHeight: '1.7' }} required></textarea>
                </div>
            </div>

            {/* SEO Settings Card */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>SEO & Search Engine Metadata</h3>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Meta Title</label>
                    <input 
                        type="text" 
                        value={metaTitle} 
                        onChange={(e) => setMetaTitle(e.target.value)} 
                        placeholder="SEO Title (defaults to blog title if left empty)" 
                        style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} 
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Meta Description</label>
                    <textarea 
                        value={metaDescription} 
                        onChange={(e) => setMetaDescription(e.target.value)} 
                        placeholder="SEO Description snippet for Google search results..." 
                        style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', minHeight: '80px', fontFamily: 'inherit' }} 
                    ></textarea>
                </div>
            </div>
            {/* FAQ Section */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: '800' }}>FAQs</h3>
                    <button type="button" onClick={addFAQ} style={{ color: '#ff4b91', fontWeight: '700', background: 'none', border: 'none' }}>+ Add Question</button>
                </div>
                {faqs.map((faq, index) => (
                    <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', position: 'relative' }}>
                        <button type="button" onClick={() => removeFAQ(index)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: '#ef4444' }}>✕</button>
                        <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFAQ(index, 'question', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', fontWeight: '700', border: 'none', background: 'transparent' }} />
                        <textarea placeholder="Answer" value={faq.answer} onChange={(e) => updateFAQ(index, 'answer', e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent' }}></textarea>
                    </div>
                ))}
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} required>
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600' }}>
                        <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} />
                        Show on Home Page
                    </label>
                </div>
                <button type="submit" disabled={isUpdating} style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', borderRadius: '12px', fontWeight: '700' }}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
      </form>
    </div>
  );
}
