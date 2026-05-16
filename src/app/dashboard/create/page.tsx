'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnHome, setShowOnHome] = useState(true);
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
        reader.onload = (event) => setPreviews(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Create New Blog</h1>
            <p style={{ color: '#64748b' }}>Share your wisdom with the world in a premium style.</p>
        </div>
        <button onClick={() => router.back()} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2.5rem' }}>
        
        {/* Left Column: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Blog Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Mastering the Art of Tech Guides..." 
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.5rem', fontWeight: '700', border: 'none', background: '#f8fafc', borderRadius: '16px' }} 
                        required 
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Short Description</label>
                    <input 
                        type="text" 
                        value={shortDescription} 
                        onChange={(e) => setShortDescription(e.target.value)} 
                        placeholder="A catchy sub-title for the home page..." 
                        style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px' }} 
                    />
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Content</label>
                    
                    {/* Toolbar Re-added */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <button type="button" onClick={() => insertTag('bold')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>B</button>
                        <button type="button" onClick={() => insertTag('underline')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', textDecoration: 'underline' }}>U</button>
                        <button type="button" onClick={() => insertTag('link')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>🔗 Link</button>
                        <button type="button" onClick={() => insertTag('code')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>💻 Code</button>
                        <button type="button" onClick={() => insertTag('bullet-list')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>• List</button>
                    </div>

                    <textarea 
                        id="blog-content-area"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Start writing your heart out..." 
                        style={{ width: '100%', minHeight: '500px', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '16px', lineHeight: '1.8', fontSize: '1.1rem' }} 
                        required
                    ></textarea>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>💡 Tip: Use [IMAGE] to place uploaded photos in text.</p>
                </div>
            </div>

            {/* FAQ Section */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: '800' }}>FAQs</h3>
                    <button type="button" onClick={addFAQ} style={{ color: '#ff4b91', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Question</button>
                </div>
                {faqs.map((faq, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', position: 'relative' }}>
                        <button type="button" onClick={() => removeFAQ(index)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444' }}>✕</button>
                        <input 
                            type="text" 
                            placeholder="Question" 
                            value={faq.question} 
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)} 
                            style={{ marginBottom: '0.75rem', fontWeight: '700', border: 'none', background: 'transparent', width: '90%' }}
                        />
                        <textarea 
                            placeholder="Answer" 
                            value={faq.answer} 
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)} 
                            style={{ width: '100%', border: 'none', background: 'transparent', minHeight: '60px' }}
                        ></textarea>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Column: Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Publishing Settings</h4>
                
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                        <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem' }} />
                        Show on Home Page
                    </label>
                </div>

                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>
                    {isLoading ? 'Publishing...' : 'Publish Now'}
                </button>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Visuals</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {previews.map((preview, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '1/1' }}>
                            <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
                        </div>
                    ))}
                    <label style={{ aspectRatio: '1/1', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <span style={{ fontSize: '1.5rem' }}>+</span>
                        <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>
            </div>
        </div>

      </form>
    </div>
  );
}
